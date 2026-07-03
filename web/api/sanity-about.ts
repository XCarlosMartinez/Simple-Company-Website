export type AboutPageResponse = {
  companyName?: string
  mainImage?: unknown
  heading?: string
  body?: string
}

const aboutPageQuery = `*[_type == "aboutPage"] | order(_updatedAt desc)[0] {
  companyName,
  mainImage,
  heading,
  body
}`

type SanityConfig = {
  projectId?: string
  dataset?: string
  apiVersion?: string
}

export async function fetchAboutPageFromSanity(config: SanityConfig) {
  const projectId = config.projectId
  const dataset = config.dataset || 'production'
  const apiVersion = config.apiVersion || '2026-07-02'

  if (!projectId) {
    throw new Error('Sanity project ID is not configured.')
  }

  const url = new URL(`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', aboutPageQuery)
  url.searchParams.set('returnQuery', 'false')

  const response = await fetch(url)
  const result = (await response.json()) as {
    result?: AboutPageResponse | null
    error?: {description?: string}
  }

  if (!response.ok) {
    throw new Error(result.error?.description || 'Unable to load about content from Sanity.')
  }

  return result.result || null
}
