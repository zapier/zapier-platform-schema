'use strict';

const _ = require('lodash');
const jsonschema = require('jsonschema');

module.exports = definition => {
  const errors = [];
  if (definition.operation && !_.get(definition, 'display.hidden')) {
    const samples = _.get(definition, 'operation.sample', {});
    if (!Object.keys(samples).length) {
      errors.push(
        new jsonschema.ValidationError(
          `required "sample" for non-hidden operation`,
          definition,
          definition.id
        )
      );
    }
  }
  return errors;
};
