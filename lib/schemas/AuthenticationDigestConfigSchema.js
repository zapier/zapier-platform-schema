'use strict';

const makeSchema = require('../utils/makeSchema');

module.exports = makeSchema({
  id: '/AuthenticationDigestConfigSchema',
  description: 'Config for Digest Authentication. Leave empty if your app uses Digets Auth.',
  type: 'object',
  properties: {},
  additionalProperties: false
});
