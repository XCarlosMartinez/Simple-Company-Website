import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Second Heading',
      type: 'string',
      initialValue: 'About Us',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Paragraph',
      type: 'text',
      rows: 6,
      validation: (rule) => rule.required().max(900),
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
      subtitle: 'heading',
      media: 'mainImage',
    },
  },
})
