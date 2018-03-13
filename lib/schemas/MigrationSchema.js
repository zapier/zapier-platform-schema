'use strict';

const makeSchema = require('../utils/makeSchema');

const FunctionSchema = require('./FunctionSchema');

module.exports = makeSchema(
  {
    id: '/MigrationSchema',
    description: 'Represents migration schemes.',
    examples: [],
    antiExamples: [],
    type: 'object',
    required: ['mapping'],
    properties: {
      mapping: {
        description:
          "An object describing each of an application's actions and the changes that need to be applied to successfully migrated steps to this version of your app",
        creates: {
          description:
            "All of your application's creates and any changes that need to be applied to migrating steps",
          type: 'object'
        },
        triggers: {
          description:
            "All of your application's triggers and any changes that need to be applied to migrating steps",
          type: 'object'
        },
        searches: {
          description:
            "All of your application's searches and any changes that need to be applied to migrating steps",
          type: 'object'
        },
        type: 'object'
      },
      pre: {
        description:
          'Function to be run before applying your mapping to a migrating step',
        $ref: FunctionSchema.id
      },
      post: {
        description:
          'Function to be run after applying your mapping to a migrating step',
        $ref: FunctionSchema.id
      },
      authentication: {
        description:
          'Function to be run when transitioning between authentications - will only run once per account',
        $ref: FunctionSchema.id
      }
    },
    additionalProperties: false
  },
  [FunctionSchema]
);
