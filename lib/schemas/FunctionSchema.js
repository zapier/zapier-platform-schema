'use strict';

const makeSchema = require('../utils/makeSchema');

module.exports = makeSchema({
  id: '/FunctionSchema',
  description:
    'Internal pointer to a function from the original source or the source code itself. Encodes arity and if `arguments` is used in the body. Note - just write normal functions and the system will encode the pointers for you. Or, provide {source: "return 1 + 2"} and the system will wrap in a function for you.',
  examples: ['$func$0$f$', '$func$2$t$', { source: 'return 1 + 2' }],
  antiExamples: ['funcy', { source: '1 + 2' }],
  oneOf: [
    { type: 'string', pattern: '^\\$func\\$\\d+\\$[tf]\\$$' },
    {
      type: 'object',
      required: ['source'],
      properties: {
        source: { type: 'string', pattern: 'return' }
      }
    }
  ]
});
