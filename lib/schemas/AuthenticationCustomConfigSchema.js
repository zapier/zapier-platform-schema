'use strict';

const makeSchema = require('../utils/makeSchema');

module.exports = makeSchema({
  id: '/AuthenticationCustomConfigSchema',
  description: 'Config for custom authentication (like API keys). Leave empty if your app uses a custom auth method.',
  type: 'object',
  properties: {},
  additionalProperties: false
});
