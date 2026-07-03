import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'

const projects = [
  {
    title: 'Harbor Point Landing Page',
    slug: 'harbor-point-landing-page',
    description: 'A polished landing page for a waterfront hospitality brand.',
  },
  {
    title: 'Northstar Consulting Website',
    slug: 'northstar-consulting-website',
    description: 'A professional services website built for clear lead generation.',
  },
  {
    title: 'Evergreen Dental Refresh',
    slug: 'evergreen-dental-refresh',
    description: 'A friendly clinic website with service pages and appointment calls to action.',
  },
  {
    title: 'Brightline Home Services',
    slug: 'brightline-home-services',
    description: 'A service business site focused on local trust and fast quote requests.',
  },
  {
    title: 'Summit Ridge Builders',
    slug: 'summit-ridge-builders',
    description: 'A project-forward contractor website for residential construction work.',
  },
  {
    title: 'Bluebird Cafe Online',
    slug: 'bluebird-cafe-online',
    description: 'A warm restaurant website with menu highlights and location details.',
  },
  {
    title: 'Ironwood Fitness Studio',
    slug: 'ironwood-fitness-studio',
    description: 'A high-energy website for class schedules, memberships, and coaching.',
  },
  {
    title: 'Clearview Accounting Group',
    slug: 'clearview-accounting-group',
    description: 'A clean accounting firm website designed around trust and expertise.',
  },
  {
    title: 'MetroTech Repair Portal',
    slug: 'metrotech-repair-portal',
    description: 'A practical repair service site with streamlined support request paths.',
  },
]

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

function projectSvg(project, index) {
  const palettes = [
    ['#16213e', '#0f3460', '#e94560'],
    ['#12372a', '#436850', '#fbfada'],
    ['#2d3250', '#424769', '#f6b17a'],
    ['#1f2544', '#474f7a', '#ffd0ec'],
    ['#352f44', '#5c5470', '#faf0e6'],
    ['#164863', '#427d9d', '#ddf2fd'],
    ['#3e3232', '#7e6363', '#f8bdeb'],
    ['#092635', '#1b4242', '#9ec8b9'],
    ['#191919', '#750e21', '#e3651d'],
  ]
  const [dark, mid, accent] = palettes[index % palettes.length]
  const initials = project.title
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="840" viewBox="0 0 1200 840">
  <rect width="1200" height="840" fill="${dark}"/>
  <path d="M0 640 C260 520 430 750 700 620 C920 515 1020 420 1200 470 L1200 840 L0 840 Z" fill="${mid}"/>
  <circle cx="940" cy="190" r="170" fill="${accent}" opacity="0.9"/>
  <rect x="90" y="92" width="1020" height="656" rx="38" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="4"/>
  <text x="110" y="170" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700">Test Project</text>
  <text x="600" y="455" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="124" font-weight="800" text-anchor="middle">${initials}</text>
  <text x="600" y="535" fill="#ffffff" fill-opacity="0.86" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" text-anchor="middle">${project.title}</text>
</svg>`.trim()
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

  for (const [index, project] of projects.entries()) {
    const asset = await client.assets.upload('image', Buffer.from(projectSvg(project, index)), {
      filename: `${project.slug}.svg`,
      contentType: 'image/svg+xml',
    })

    const existing = await client.fetch('*[_type == "project" && slug.current == $slug][0]._id', {
      slug: project.slug,
    })

    const document = {
      _type: 'project',
      title: project.title,
      slug: {_type: 'slug', current: project.slug},
      description: project.description,
      sortOrder: (index + 1) * 10,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
    }

    if (existing) {
      await client.patch(existing).set(document).commit()
      console.log(`Updated ${project.title}`)
    } else {
      await client.create(document)
      console.log(`Created ${project.title}`)
    }
  }

  console.log('Done seeding 9 test projects.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
