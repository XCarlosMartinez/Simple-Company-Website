import {defineField, defineType} from 'sanity'

const ctaFields = [
  defineField({
    name: 'label',
    title: 'Label',
    type: 'string',
    validation: (rule) => rule.required().max(40),
  }),
  defineField({
    name: 'href',
    title: 'Link',
    type: 'string',
    description: 'Use a site path such as /services or /contact-us.',
    validation: (rule) => rule.required().max(80),
  }),
]

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
          validation: (rule) => rule.required().max(60),
        }),
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
          validation: (rule) => rule.required().max(120),
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required().max(260),
        }),
        defineField({
          name: 'primaryCta',
          title: 'Primary Call to Action',
          type: 'object',
          fields: ctaFields,
        }),
        defineField({
          name: 'secondaryCta',
          title: 'Secondary Call to Action',
          type: 'object',
          fields: ctaFields,
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'servicesPreview',
      title: 'Services Preview',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required().max(80),
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.required().max(220),
        }),
        defineField({
          name: 'itemLimit',
          title: 'Number of Services to Show',
          type: 'number',
          initialValue: 3,
          validation: (rule) => rule.required().integer().min(1).max(6),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'projectsPreview',
      title: 'Projects Preview',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required().max(80),
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.required().max(220),
        }),
        defineField({
          name: 'itemLimit',
          title: 'Number of Projects to Show',
          type: 'number',
          initialValue: 3,
          validation: (rule) => rule.required().integer().min(1).max(6),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'industriesPreview',
      title: 'Industries Preview',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required().max(80),
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.required().max(220),
        }),
        defineField({
          name: 'itemLimit',
          title: 'Number of Industries to Show',
          type: 'number',
          initialValue: 4,
          validation: (rule) => rule.required().integer().min(1).max(8),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'finalCta',
      title: 'Final Call to Action',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required().max(90),
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.required().max(220),
        }),
        defineField({
          name: 'button',
          title: 'Button',
          type: 'object',
          fields: ctaFields,
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'hero.headline',
      subtitle: 'hero.eyebrow',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Home Page',
        subtitle: subtitle || 'Homepage content',
      }
    },
  },
})
