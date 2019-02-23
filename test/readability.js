'use strict';

require('should');

const AuthenticationSchema = require('../lib/schemas/AuthenticationSchema');
const CreateSchema = require('../lib/schemas/CreateSchema');
const FlatObjectSchema = require('../lib/schemas/FlatObjectSchema');

describe('readability', () => {
  it('should have decent messages for anyOf mismatches', () => {
    const results = AuthenticationSchema.validate({
      type: 'oauth2',
      test: 'whateverfake!'
    });
    results.errors.should.have.length(1);
    results.errors[0].stack.should.eql('instance is not of a type(s) object');
  });

  it('should have decent messages for minimum length not met', () => {
    const results = CreateSchema.validate({
      key: 'recipe',
      noun: 'Recipe',
      display: {
        label: '',
        description: 'Creates a new recipe.'
      },
      operation: {
        perform: '$func$2$f$',
        sample: { id: 1 }
      }
    });
    results.errors.should.have.length(1);
    results.errors[0].stack.should.eql(
      'instance.display.label does not meet minimum length of 2'
    );
  });

  it('should have decent messages for value type mismatch', () => {
    const results = CreateSchema.validate({
      key: 'recipe',
      noun: 'Recipe',
      display: {
        label: 'Create Recipe',
        description: 'Creates a new recipe.'
      },
      operation: {
        perform: '$func$2$f$',
        sample: { id: 1 },
        inputFields: [1]
      }
    });
    results.errors.should.have.length(1);
    results.errors[0].stack.should.eql('instance is not of a type(s) object');
  });

  it('should surface deep issues', () => {
    const results = CreateSchema.validate({
      key: 'recipe',
      noun: 'Recipe',
      display: {
        label: 'Create Recipe',
        description: 'Creates a new recipe.'
      },
      operation: {
        perform: '$func$2$f$',
        sample: { id: 1 },
        inputFields: [{ key: 'field', type: 'string', default: '' }]
      }
    });
    results.errors.should.have.length(1);
    results.errors[0].property.should.eql(
      'instance.operation.inputFields[0].default'
    );
    results.errors[0].message.should.eql('does not meet minimum length of 1');
  });

  it('should work on weird schemas', () => {
    const results = FlatObjectSchema.validate({
      a: {},
      b: []
    });
    results.errors.should.have.length(2);
    results.errors[0].property.should.eql('instance.a');
    results.errors[0].message.should.startWith('is not any of [subschema');
  });
});
