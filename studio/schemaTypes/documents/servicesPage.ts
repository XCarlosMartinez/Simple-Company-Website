import {defineArrayMember, defineField, defineType} from 'sanity'

const contentItem = defineArrayMember({
  name: 'contentItem',
  title: 'Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})

export default defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    defineField({
      name: 'services',
      title: 'Services Provided',
      type: 'object',
      fields: [
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.required().max(220),
        }),
        defineField({
          name: 'items',
          title: 'Services',
          type: 'array',
          of: [contentItem],
          validation: (rule) => rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'industries',
      title: 'Industries Served',
      type: 'object',
      fields: [
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.required().max(220),
        }),
        defineField({
          name: 'items',
          title: 'Industries',
          type: 'array',
          of: [contentItem],
          validation: (rule) => rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'pastProjects',
      title: 'Past Projects',
      type: 'object',
      fields: [
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.required().max(220),
        }),
        defineField({
          name: 'completedCount',
          title: 'Completed Project Count',
          type: 'number',
          validation: (rule) => rule.required().integer().min(0),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Services Page',
        subtitle: 'Services, industries, and past projects summary',
      }
    },
  },
})
