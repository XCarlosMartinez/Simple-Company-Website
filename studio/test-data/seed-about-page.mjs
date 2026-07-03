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

function aboutSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
  <rect width="1000" height="1000" fill="#151821"/>
  <circle cx="730" cy="230" r="220" fill="#7c2dff" opacity="0.82"/>
  <path d="M0 760 C180 610 320 840 520 690 C690 560 780 610 1000 500 L1000 1000 L0 1000 Z" fill="#273142"/>
  <rect x="110" y="120" width="780" height="760" rx="42" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="5"/>
  <text x="500" y="465" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="800" text-anchor="middle">About</text>
  <text x="500" y="555" fill="#ffffff" fill-opacity="0.84" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" text-anchor="middle">Simple Company</text>
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

  const asset = await client.assets.upload('image', Buffer.from(aboutSvg()), {
    filename: 'about-simple-company.svg',
    contentType: 'image/svg+xml',
  })

  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    companyName: 'Simple Company',
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    },
    heading: 'About Us',
    body:
      'Simple Company helps businesses build clear, polished websites that explain their services, showcase their work, and make it easier for customers to get in touch.',
  })

  console.log('Seeded About Page content.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
