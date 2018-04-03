module.exports = {
  ROOT_GITHUB: 'https://github.com/zapier/zapier-platform-schema',
  DOCS_PATH: 'docs/build/schema.md',
  MUTUALLY_EXCLUSIVE_FIELDS: [
    ['children', 'list'], // This is actually a Feature Request (https://github.com/zapier/zapier-platform-cli/issues/115)
    ['children', 'dict'], // dict is ignored
    ['children', 'type'], // type is ignored
    ['children', 'placeholder'], // placeholder is ignored
    ['children', 'helpText'], // helpText is ignored
    ['children', 'default'], // default is ignored
    ['dict', 'list'], // Use only one or the other
    ['dynamic', 'dict'], // dict is ignored
    ['dynamic', 'choices'] // choices are ignored
  ]
};
