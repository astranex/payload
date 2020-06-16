const NestedRepeater = {
  slug: 'nested-repeaters',
  labels: {
    singular: 'Nested Repeater',
    plural: 'Nested Repeaters',
  },
  policies: {
    read: () => true,
  },
  fields: [
    {
      type: 'repeater',
      label: 'Repeater',
      name: 'repeater',
      required: true,
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          type: 'repeater',
          name: 'nestedRepeater',
          required: true,
          fields: [
            {
              name: 'repeaterText1',
              label: 'Repeater Text 1',
              type: 'text',
              required: true,
            }, {
              name: 'repeaterText2',
              label: 'Repeater Text 2',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
};

module.exports = NestedRepeater;