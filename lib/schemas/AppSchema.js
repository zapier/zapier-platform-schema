'use strict';

const makeSchema = require('../utils/makeSchema');

const AuthenticationSchema = require('./AuthenticationSchema');
const CodeSchema = require('./CodeSchema');
const CreatesSchema = require('./CreatesSchema');
const FlatObjectSchema = require('./FlatObjectSchema');
const HydratorsSchema = require('./HydratorsSchema');
const MiddlewaresSchema = require('./MiddlewaresSchema');
const RequestSchema = require('./RequestSchema');
const ResourcesSchema = require('./ResourcesSchema');
const SearchOrCreatesSchema = require('./SearchOrCreatesSchema');
const SearchesSchema = require('./SearchesSchema');
const TriggersSchema = require('./TriggersSchema');
const VersionSchema = require('./VersionSchema');

module.exports = makeSchema(
  {
    id: '/AppSchema',
    description: 'Represents a full app.',
    type: 'object',
    required: ['version', 'platformVersion'],
    properties: {
      version: {
        description: 'A version identifier for your code.',
        $ref: VersionSchema.id
      },
      platformVersion: {
        description:
          'A version identifier for the Zapier execution environment.',
        $ref: VersionSchema.id
      },
      authentication: {
        description: 'Choose what scheme your API uses for authentication.',
        $ref: AuthenticationSchema.id
      },
      requestTemplate: {
        description:
          'Define a request mixin, great for setting custom headers, content-types, etc.',
        $ref: RequestSchema.id
      },
      beforeRequest: {
        description:
          'Before an HTTP request is sent via our `z.request()` client, you can modify it.',
        $ref: MiddlewaresSchema.id
      },
      afterResponse: {
        description:
          'After an HTTP response is recieved via our `z.request()` client, you can modify it.',
        $ref: MiddlewaresSchema.id
      },
      hydrators: {
        description:
          "An optional bank of named functions that you can use in `z.hydrate('someName')` to lazily load data.",
        $ref: HydratorsSchema.id
      },
      resources: {
        description:
          'All the resources for your app. Zapier will take these and generate the relevent triggers/searches/creates automatically.',
        $ref: ResourcesSchema.id
      },
      triggers: {
        description:
          'All the triggers for your app. You can add your own here, or Zapier will automatically register any from the list/hook methods on your resources.',
        $ref: TriggersSchema.id
      },
      searches: {
        description:
          'All the searches for your app. You can add your own here, or Zapier will automatically register any from the search method on your resources.',
        $ref: SearchesSchema.id
      },
      creates: {
        description:
          'All the creates for your app. You can add your own here, or Zapier will automatically register any from the create method on your resources.',
        $ref: CreatesSchema.id
      },
      searchOrCreates: {
        description:
          'All the search-or-create combos for your app. You can create your own here, or Zapier will automatically register any from resources that define a search, a create, and a get (or define a searchOrCreate directly). Register non-resource search-or-creates here as well.',
        $ref: SearchOrCreatesSchema.id
      },
      legacyScriptingSource: {
        description:
          '**INTERNAL USE**. Zapier uses this to store the scripting code from a legacy Web Builder app.',
        $ref: CodeSchema.id
      }
    },
    additionalProperties: false
  },
  [
    AuthenticationSchema,
    CodeSchema,
    CreatesSchema,
    FlatObjectSchema,
    HydratorsSchema,
    MiddlewaresSchema,
    RequestSchema,
    ResourcesSchema,
    SearchOrCreatesSchema,
    SearchesSchema,
    TriggersSchema,
    VersionSchema
  ]
);
