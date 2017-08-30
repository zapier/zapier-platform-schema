'use strict';

const _ = require('lodash');
const jsonschema = require('jsonschema');

// NOTE: While it would be possible to accomplish this with a solution like
//   https://stackoverflow.com/questions/28162509/mutually-exclusive-property-groups#28172831
//   it was harder to read and understand.

const incompatibleFields = [
  ['children', 'list'],
  ['dict', 'list'],
  ['dynamic', 'dict'],
  ['dynamic', 'choices'],
];

const collectErrors = (inputFields, path) => {
  const errors = [];

  _.each(inputFields, (inputField, index) => {
    _.each(incompatibleFields, (fieldGroup) => {
      if (inputField.hasOwnProperty(fieldGroup[0]) && inputField.hasOwnProperty(fieldGroup[1])) {
        errors.push(new jsonschema.ValidationError(
          `must not contain ${fieldGroup[0]} and ${fieldGroup[1]}, as they're mutually exclusive.`,
          inputField,
          '/FieldSchema',
          `instance.${path}.inputFields[${index}]`,
          'invalid',
          'inputFields'
        ));
      }
    });
  });

  return errors;
};

const mutuallyExclusiveFields = (definition) => {
  let errors = [];

  _.each(['triggers', 'searches', 'creates'], (typeOf) => {
    if (definition[typeOf]) {
      _.each(definition[typeOf], (actionDef) => {
        if (actionDef.operation && actionDef.operation.inputFields) {
          errors = errors.concat(collectErrors(actionDef.operation.inputFields, `${typeOf}.${actionDef.key}`));
        }
      });
    }
  });

  return errors;
};

module.exports = mutuallyExclusiveFields;
