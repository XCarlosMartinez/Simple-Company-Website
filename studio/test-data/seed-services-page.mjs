import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'

function loadEnvFile(path) {
  try {
    const env = readFileSync(path, 'utf8')

    for (const line of env.split(/\r?\n/)) {
      const match = line.match(/^([^#=\s]+)=(.*)$/)
      if (!match) continue

      const [, key, rawValue] = match
      if (!process.env[key]) {
        process.env[key] = rawValue.trim().replace(/^["']|["']$/g, '')
      }
    }
  } catch {
    // Env files are optional; Vercel/CI can provide values directly.
  }
}

const servicesPage = {
  _id: 'servicesPage',
  _type: 'servicesPage',
  services: {
    subtitle:
      'We plan, design, and build websites that help companies present their work clearly and turn visitors into leads.',
    items: [
      {
        _key: 'website-design',
        title: 'Website Design',
        description:
          'Custom page layouts, visual systems, and responsive interfaces tailored to your company.',
      },
      {
        _key: 'website-development',
        title: 'Website Development',
        description:
          'Fast, maintainable websites built with modern frontend tools and content management.',
      },
      {
        _key: 'content-management',
        title: 'Content Management',
        description:
          'Sanity-powered editing workflows so your team can update pages, projects, and copy.',
      },
      {
        _key: 'lead-generation',
        title: 'Lead Generation',
        description:
          'Contact forms, calls to action, and page structure focused on turning interest into inquiries.',
      },
      {
        _key: 'seo-foundations',
        title: 'SEO Foundations',
        description:
          'Clean page structure, metadata planning, and performance-minded builds for discoverability.',
      },
      {
        _key: 'maintenance-support',
        title: 'Maintenance & Support',
        description:
          'Ongoing updates, improvements, and technical support after the website launches.',
      },
    ],
  },
  industries: {
    subtitle:
      'We work with companies that need a professional online presence, clear service messaging, and project credibility.',
    items: [
      {
        _key: 'restaurants',
        title: 'Restaurants & Hospitality',
        description:
          'Websites for menus, reservations, locations, catering, and brand-focused customer experiences.',
      },
      {
        _key: 'construction',
        title: 'Construction & Contractors',
        description:
          'Project portfolios, service pages, and quote-focused experiences for trade businesses.',
      },
      {
        _key: 'professional-services',
        title: 'Professional Services',
        description:
          'Clear websites for consultants, accountants, legal teams, and business service providers.',
      },
      {
        _key: 'health-wellness',
        title: 'Health & Wellness',
        description:
          'Trust-building sites for clinics, studios, wellness providers, and appointment-led businesses.',
      },
      {
        _key: 'local-services',
        title: 'Local Services',
        description:
          'Practical websites for repair, home, cleaning, landscaping, and appointment-based companies.',
      },
      {
        _key: 'retail-brands',
        title: 'Retail & Product Brands',
        description:
          'Brand-forward websites for product stories, collections, store information, and customer trust.',
      },
    ],
  },
  pastProjects: {
    subtitle: 'A growing body of completed work across local businesses and service brands.',
    completedCount: 12,
  },
}

async function main() {
  loadEnvFile(resolve(process.cwd(), '.env'))
  loadEnvFile(resolve(process.cwd(), '..', 'web', '.env'))

  const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
  const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production'
  const apiVersion =
    process.env.SANITY_STUDIO_API_VERSION || process.env.VITE_SANITY_API_VERSION || '2026-07-02'
  const token = process.env.SANITY_AUTH_TOKEN

  if (!projectId || !token) {
    throw new Error(
      'Missing Sanity config. Set SANITY_STUDIO_PROJECT_ID and SANITY_AUTH_TOKEN before running this script.',
    )
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })

  await client.createOrReplace(servicesPage)
  console.log('Seeded Services Page content.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
