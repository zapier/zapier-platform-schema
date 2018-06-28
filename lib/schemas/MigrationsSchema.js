'use strict';

const makeSchema = require('../utils/makeSchema');

const MigrationSchema = require('./MigrationSchema');

module.exports = makeSchema(
  {
    id: '/MigrationsSchema',
    description: 'Enumerates the migrations your app has available.',
    type: 'array',
    items: { $ref: MigrationSchema.id },
    additionalProperties: false
  },
  [MigrationSchema]
);
