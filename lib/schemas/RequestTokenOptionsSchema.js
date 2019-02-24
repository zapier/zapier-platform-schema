'use-strict';

const makeSchema = require('../utils/makeSchema');

module.exports = makeSchema({
  id: '/RequestTokenOptionsSchema',
  description:
    "A set of boolean values that determine how to replace curly strings such as '{{bundle.inputData.foo}} with its actual value.",
  type: 'object',
  properties: {
    queryParams: {
      description:
        'Refers to tokens sent via a requests query params (`req.params`)',
      type: 'boolean',
      default: false
    },
    body: {
      description: 'Refers to tokens sent via a requsts body (`req.body`)',
      type: 'boolean',
      default: false
    }
  }
});
