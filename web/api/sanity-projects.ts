export type ProjectResponse = {
  _id: string
  title: string
  slug?: string
  mainImage?: unknown
  description: string
  sortOrder?: number
}

const projectsQuery = `*[_type == "project"] | order(sortOrder asc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  description,
  sortOrder
}`

type SanityConfig = {
  projectId?: string
  dataset?: string
  apiVersion?: string
}

export async function fetchProjectsFromSanity(config: SanityConfig) {
  const projectId = config.projectId
  const dataset = config.dataset || 'production'
  const apiVersion = config.apiVersion || '2026-07-02'

  if (!projectId) {
    throw new Error('Sanity project ID is not configured.')
  }

  const url = new URL(`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', projectsQuery)
  url.searchParams.set('returnQuery', 'false')

  const response = await fetch(url)
  const result = (await response.json()) as {
    result?: ProjectResponse[]
    error?: {description?: string}
  }

  if (!response.ok) {
    throw new Error(result.error?.description || 'Unable to load projects from Sanity.')
  }

  return result.result || []
}
