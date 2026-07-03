import {fetchServicesPageFromSanity} from './sanity-services.js'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({message: 'Method not allowed.'})
  }

  try {
    const servicesPage = await fetchServicesPageFromSanity({
      projectId: process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET,
      apiVersion: process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION,
    })

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json({servicesPage})
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to load services content from Sanity.'

    return res.status(500).json({message})
  }
}
