'use strict';

const jsonschema = require('jsonschema');
const links = require('./links');
const functionalConstraints = require('../functional-constraints');
const { flattenDeep } = require('lodash');

const ambiguousTypes = ['anyOf', 'oneOf', 'allOf'];

const makeLinks = (error, makerFunc) => {
  if (typeof error.schema === 'string') {
    return [makerFunc(error.schema)];
  }
  if (
    ambiguousTypes.includes(error.name) &&
    error.argument &&
    error.argument.length
  ) {
    return error.argument.map(makerFunc);
  }
  return [];
};

const removeFirstAndLastChar = s => s.slice(1, -1);
const makePath = (path, newSegment) =>
  path ? [path, newSegment].join('.') : newSegment;

const cleanError = (validationError, path, validator) => {
  if (ambiguousTypes.includes(validationError.name)) {
    // TODO: make this smarter
    // if it's triggerSchema, check for "type"
    // if it's request/function, check for "source" or "require". if neither are present, validate against request
    // if it's flatobject, probably just raise the regular one, it says it has to be a primative
    // otherwise, maybe raise regular and drop a note to file an issue so we can consider that case?
    const nextSchema = validationError.argument[0];

    const res = validator.validate(
      validationError.instance,
      validator.schemas[removeFirstAndLastChar(nextSchema)]
    );
    return res.errors.map(e =>
      cleanError(e, makePath(path, validationError.property), validator)
    );
  } else {
    // base case
    const completePath = makePath(path, validationError.property).replace(
      /\.instance\./g,
      '.'
    );

    validationError.property = completePath;
    return validationError;
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
