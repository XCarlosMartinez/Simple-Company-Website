import {useCallback, useEffect, useState} from 'react'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {urlFor} from '../sanity/image'
import {readApiResponse} from '../utils/apiResponse'

type Project = {
  _id: string
  title: string
  slug: string
  mainImage?: SanityImageSource
  description: string
  sortOrder?: number
}

let cachedProjects: Project[] = []

function Projects() {
  const [projects, setProjects] = useState<Project[]>(cachedProjects)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    cachedProjects.length ? 'success' : 'loading',
  )
  const [errorMessage, setErrorMessage] = useState('')

  const loadProjects = useCallback(async () => {
    setStatus((current) => (current === 'success' ? current : 'loading'))
    setErrorMessage('')

    try {
      const response = await fetch('/api/projects')
      const result = await readApiResponse<{projects?: Project[]; message?: string}>(response)

      if (!response.ok) {
        throw new Error(result.message || 'Sanity projects could not be loaded.')
      }

      cachedProjects = result.projects || []
      setProjects(cachedProjects)
      setStatus('success')
    } catch (error) {
      setStatus(projects.length ? 'success' : 'error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Sanity projects could not be loaded.',
      )
    }
  }, [projects.length])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  return (
    <main className="page projects-page">
      <section className="page-section projects-section">
        <div className="projects-intro">
          <p className="eyebrow">Projects</p>
          <h1>Our Work</h1>
          <p>Browse recent projects and the work behind them.</p>
        </div>

        {status === 'loading' ? <p className="projects-status">Loading projects...</p> : null}

        {status === 'error' ? (
          <div className="projects-status error">
            <p>Projects could not be loaded from Sanity right now.</p>
            {errorMessage ? <small>{errorMessage}</small> : null}
            <button type="button" onClick={loadProjects}>
              Retry
            </button>
          </div>
        ) : null}

        {status === 'success' && projects.length === 0 ? (
          <p className="projects-status">No projects have been added yet.</p>
        ) : null}

        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project._id}>
                <div className="project-image-wrap">
                  {project.mainImage ? (
                    <img
                      src={urlFor(project.mainImage).width(800).height(560).fit('crop').url()}
                      alt=""
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="project-card-body">
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default Projects
