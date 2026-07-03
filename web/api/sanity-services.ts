export type ServiceItemResponse = {
  _key: string
  title: string
  description: string
}

export type ServicesPageResponse = {
  services?: {
    subtitle?: string
    items?: ServiceItemResponse[]
  }
  industries?: {
    subtitle?: string
    items?: ServiceItemResponse[]
  }
  pastProjects?: {
    subtitle?: string
    completedCount?: number
  }
}

const servicesPageQuery = `*[_type == "servicesPage"] | order(_updatedAt desc)[0] {
  services {
    subtitle,
    items[] {
      _key,
      title,
      description
    }
  },
  industries {
    subtitle,
    items[] {
      _key,
      title,
      description
    }
  },
  pastProjects {
    subtitle,
    completedCount
  }
}`

type SanityConfig = {
  projectId?: string
  dataset?: string
  apiVersion?: string
}

export async function fetchServicesPageFromSanity(config: SanityConfig) {
  const projectId = config.projectId
  const dataset = config.dataset || 'production'
  const apiVersion = config.apiVersion || '2026-07-02'

  if (!projectId) {
    throw new Error('Sanity project ID is not configured.')
  }

  const url = new URL(`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', servicesPageQuery)
  url.searchParams.set('returnQuery', 'false')

  const response = await fetch(url)
  const result = (await response.json()) as {
    result?: ServicesPageResponse | null
    error?: {description?: string}
  }

  if (!response.ok) {
    throw new Error(result.error?.description || 'Unable to load services content from Sanity.')
  }

  return result.result || null
}
