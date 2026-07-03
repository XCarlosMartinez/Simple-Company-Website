export type HomePageResponse = {
  hero?: {
    eyebrow?: string
    headline?: string
    subtitle?: string
    primaryCta?: {
      label?: string
      href?: string
    }
    secondaryCta?: {
      label?: string
      href?: string
    }
  }
  servicesPreview?: {
    title?: string
    subtitle?: string
    itemLimit?: number
  }
  projectsPreview?: {
    title?: string
    subtitle?: string
    itemLimit?: number
  }
  industriesPreview?: {
    title?: string
    subtitle?: string
    itemLimit?: number
  }
  finalCta?: {
    title?: string
    subtitle?: string
    button?: {
      label?: string
      href?: string
    }
  }
}

const homePageQuery = `*[_type == "homePage"] | order(_updatedAt desc)[0] {
  hero {
    eyebrow,
    headline,
    subtitle,
    primaryCta {
      label,
      href
    },
    secondaryCta {
      label,
      href
    }
  },
  servicesPreview {
    title,
    subtitle,
    itemLimit
  },
  projectsPreview {
    title,
    subtitle,
    itemLimit
  },
  industriesPreview {
    title,
    subtitle,
    itemLimit
  },
  finalCta {
    title,
    subtitle,
    button {
      label,
      href
    }
  }
}`

type SanityConfig = {
  projectId?: string
  dataset?: string
  apiVersion?: string
}

export async function fetchHomePageFromSanity(config: SanityConfig) {
  const projectId = config.projectId
  const dataset = config.dataset || 'production'
  const apiVersion = config.apiVersion || '2026-07-02'

  if (!projectId) {
    throw new Error('Sanity project ID is not configured.')
  }

  const url = new URL(`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', homePageQuery)
  url.searchParams.set('returnQuery', 'false')

  const response = await fetch(url)
  const result = (await response.json()) as {
    result?: HomePageResponse | null
    error?: {description?: string}
  }

  if (!response.ok) {
    throw new Error(result.error?.description || 'Unable to load home content from Sanity.')
  }

  return result.result || null
}
