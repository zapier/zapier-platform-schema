'use strict';

const makeSchema = require('../utils/makeSchema');

const BasicDisplaySchema = require('./BasicDisplaySchema');
const BasicActionOperationSchema = require('./BasicActionOperationSchema');

module.exports = makeSchema(
  {
    id: '/ResourceMethodMiscSchema',
    description:
      'How will we find perform a miscellaneous action for a specific object given inputs? Will be turned into an action automatically.',
    type: 'object',
    required: ['display', 'operation'],
    examples: [
      {
        display: {
          label: 'Reticulate Tag',
          description: 'Reticulate a Tag in your account.'
        },
        operation: {
          perform: '$func$2$f$',
          sample: {
            id: 1
          }
        }
      },
      {
        display: {
          label: 'Reticulate Tag',
          description: 'Reticulate a Tag in your account.',
          hidden: true
        },
        operation: {
          perform: '$func$2$f$'
        }
      }
    ],
    antiExamples: [
      {
        display: {
          label: 'Reticulate Tag',
          description: 'Reticulate a Tag in your account.'
        },
        operation: {
          perform: '$func$2$f$'
        }
      }
    ],
    properties: {
      display: {
        description: 'Define how this misc method will be exposed in the UI.',
        $ref: BasicDisplaySchema.id
      },
      operation: {
        description: 'Define how this misc method will work.',
        $ref: BasicActionOperationSchema.id
      }
    },
    additionalProperties: false
  },
  [BasicDisplaySchema, BasicActionOperationSchema]
);
