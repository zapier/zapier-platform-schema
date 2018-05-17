'use strict';

const makeSchema = require('../utils/makeSchema');

module.exports = makeSchema({
  id: '/CodeSchema',
  description: 'Free-form source code without validation.',
  examples: ['', 'any text', 'var Zap = {};', "console.log('hello');"],
  antiExamples: [123, {}, []],
  type: 'string'
});
