import {createClient} from '@sanity/client'

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id'
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2026-07-02'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
