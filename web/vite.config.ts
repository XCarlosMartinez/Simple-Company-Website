import {defineConfig, loadEnv, type Plugin} from 'vite'
import react from '@vitejs/plugin-react'
import {fetchProjectsFromSanity} from './api/sanity-projects.js'

function projectsApiPlugin(): Plugin {
  return {
    name: 'projects-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')

      server.middlewares.use('/api/projects', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.setHeader('Allow', 'GET')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({message: 'Method not allowed.'}))
          return
        }

        try {
          const projects = await fetchProjectsFromSanity({
            projectId: env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID,
            dataset: env.SANITY_DATASET || env.VITE_SANITY_DATASET,
            apiVersion: env.SANITY_API_VERSION || env.VITE_SANITY_API_VERSION,
          })

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({projects}))
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Unable to load projects from Sanity.'

          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({message}))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [projectsApiPlugin(), react()],
})
