'use strict';

const makeSchema = require('../utils/makeSchema');

module.exports = makeSchema({
  id: '/AuthenticationBasicConfigSchema',
  description: 'Config for Basic Authentication. Leave empty if your app uses Basic Auth.',
  type: 'object',
  properties: {},
  additionalProperties: false
});
