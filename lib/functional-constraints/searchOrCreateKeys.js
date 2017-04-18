'use strict';

const _ = require('lodash');
const jsonschema = require('jsonschema');

const validateSearchOrCreateKeys = (definition) => {
  if (!definition.searchOrCreates) {
    return [];
  }

  const errors = [];
  const searchKeys = _.keys(definition.searches);
  _.each(definition.searchOrCreates, (searchOrCreateDef, key) => {
    const searchKey = searchOrCreateDef.search;
    if (!definition.searches[searchKey]) {
      errors.push(new jsonschema.ValidationError(
        `must match a "key" from a search (options: ${searchKeys})`,
        searchOrCreateDef,
        '/SearchOrCreateSchema',
        `instance.searchOrCreates.${key}.search`,
        'invalidKey',
        'search'
      ));
    }
  });

  return errors;
};

module.exports = validateSearchOrCreateKeys;
