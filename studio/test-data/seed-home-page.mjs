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

const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  hero: {
    eyebrow: 'Simple Company',
    headline: 'Websites built for growing local businesses.',
    subtitle:
      'We design and develop professional websites that clearly explain your services, showcase your work, and help visitors become customers.',
    primaryCta: {
      label: 'View Services',
      href: '/services',
    },
    secondaryCta: {
      label: 'Contact Us',
      href: '/contact-us',
    },
  },
  servicesPreview: {
    title: 'What We Do',
    subtitle: 'Explore a few of the services we provide for businesses that need a stronger online presence.',
    itemLimit: 3,
  },
  projectsPreview: {
    title: 'Featured Projects',
    subtitle: 'See recent work and the project stories behind each build.',
    itemLimit: 3,
  },
  industriesPreview: {
    title: 'Industries We Serve',
    subtitle: 'We support service-focused businesses across several local and professional industries.',
    itemLimit: 4,
  },
  finalCta: {
    title: 'Ready to start your next project?',
    subtitle: 'Tell us what you are building and we will help you shape a clear path forward.',
    button: {
      label: 'Contact Us',
      href: '/contact-us',
    },
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

  await client.createOrReplace(homePage)
  console.log('Seeded Home Page content.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
