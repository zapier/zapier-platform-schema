'use strict';

const jsonschema = require('jsonschema');
const links = require('./links');
const functionalConstraints = require('../functional-constraints');
const { flattenDeep } = require('lodash');

const ambiguousTypes = ['anyOf', 'oneOf', 'allOf'];

const makeLinks = (error, makerFunc) => {
  // debugger; // eslint-disable-line no-debugger
  if (typeof error.schema === 'string') {
    return [makerFunc(error.schema)];
  }
  if (
    ambiguousTypes.includes(error.name) &&
    error.argument &&
    error.argument.length
  ) {
    // no way to know what the subschema was, so don't create links for it
    return error.argument
      .map(s => (s.includes('subschema') ? '' : makerFunc(s)))
      .filter(Boolean);
  }
  return [];
};

const removeFirstAndLastChar = s => s.slice(1, -1);
// always return a string
const makePath = (path, newSegment) =>
  (path ? [path, newSegment].join('.') : newSegment) || '';

const processBaseError = (err, path) => {
  const completePath = makePath(path, err.property).replace(
    /\.instance\./g,
    '.'
  );

  const subSchemas = err.message.match(/\[subschema \d+\]/g);
  if (subSchemas) {
    subSchemas.forEach((subschema, idx) => {
      // err.schema is either an anonymous schema object or the name of a named schema
      if (typeof err.schema === 'string') {
        // this is basically only for FieldChoicesSchema and I'm not sure why
        err.message += ' Consult the docs below for valid subschemas.';
      } else {
        // the subschemas have a type property
        err.message = err.message.replace(
          subschema,
          err.schema[err.name][idx].type || 'unknown'
        );
      }
    });
  }

  err.property = completePath;
  return err;
};

/**
 * We have a lot of `anyOf` schemas that return ambiguous errors. This recurses down the schema until it finds the errors that cause the failures replaces the ambiguity.
 * @param {ValidationError} validationError an individual error
 * @param {string} path current path in the error chain
 * @param {Validator} validator validator object to pass around that has all the schemas
 */
const cleanError = (validationError, path, validator) => {
  if (ambiguousTypes.includes(validationError.name)) {
    // flatObjectSchema requires each property to be a type. instead of recursing down, it's more valuable to say "hey, it's not of these types"
    if (validationError.argument.every(s => s.includes('subschema'))) {
      return processBaseError(validationError, path);
    }

    // Try against each of A, B, and C to take a guess as to which it's closed to
    // errorGroups will be an array of arrays of errors
    const errorGroups = validationError.argument.map((schemaName, idx) => {
      // this is what we'll validate against next
      let nextSchema;
      // schemaName is either "[subschema n]" or "/NamedSchema"
      if (schemaName.startsWith('[subschema')) {
        const maybeNamedSchema = validator.schemas[validationError.schema];

        if (maybeNamedSchema) {
          nextSchema = maybeNamedSchema[validationError.name][idx];
        } else {
          // hoist the anonymous subschema up
          nextSchema = validationError.schema[validationError.name][idx];
        }
      } else {
        nextSchema = validator.schemas[removeFirstAndLastChar(schemaName)];
      }

      const res = validator.validate(validationError.instance, nextSchema);
      if (!res.errors.length) {
        // This is a case that I can no longer reproduce, but it caused really weird behavior so I'm going to leave this as a canary for now
        // in theory this should never happen - all schemas at this point should have errors
        throw new Error(
          'If you see this, please file an issue at https://github.com/zapier/zapier-platform-cli/issues'
        );
      }
      return res.errors.map(e =>
        cleanError(e, makePath(path, validationError.property), validator)
      );
    });

    // find the group with the fewest errors, that's probably the most accurate
    // if we're goign to tweak what gets returned, this is where we'll do it
    // a possible improvement could be treating a longer path favorably, like the python implementation does
    errorGroups.sort((a, b) => a.length - b.length);
    return errorGroups[0];
  } else {
    // base case
    return processBaseError(validationError, path);
  }
};

const makeValidator = (mainSchema, subSchemas) => {
  const schemas = [mainSchema].concat(subSchemas || []);
  const v = new jsonschema.Validator();
  schemas.forEach(Schema => {
    v.addSchema(Schema, Schema.id);
  });
  return {
    validate: definition => {
      const { errors, ...results } = v.validate(definition, mainSchema);
      const allErrors = errors.concat(
        functionalConstraints.run(definition, mainSchema)
      );
      const cleanedErrors = flattenDeep(
        allErrors.map(e => cleanError(e, '', v))
      );

      results.errors = cleanedErrors.map(error => {
        error.codeLinks = makeLinks(error, links.makeCodeLink);
        error.docLinks = makeLinks(error, links.makeDocLink);
        return error;
      });
      return results;
    }
  };
};

module.exports = makeValidator;
