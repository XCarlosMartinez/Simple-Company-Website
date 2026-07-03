import {useCallback, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {readApiResponse} from '../utils/apiResponse'

type ServiceItem = {
  _key: string
  title: string
  description: string
}

type ServicesPageContent = {
  services?: {
    subtitle?: string
    items?: ServiceItem[]
  }
  industries?: {
    subtitle?: string
    items?: ServiceItem[]
  }
  pastProjects?: {
    subtitle?: string
    completedCount?: number
  }
}

let cachedServicesContent: ServicesPageContent | null = null

function ContentListSection({
  title,
  section,
}: {
  title: string
  section?: ServicesPageContent['services']
}) {
  if (!section?.subtitle && !section?.items?.length) {
    return null
  }

  return (
    <section className="service-content-section">
      <div className="section-heading">
        <h2>{title}</h2>
        {section.subtitle ? <p>{section.subtitle}</p> : null}
      </div>

      {section.items?.length ? (
        <div className="service-list-grid">
          {section.items.map((item) => (
            <article className="service-list-card" key={item._key}>
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

function Services() {
  const [content, setContent] = useState<ServicesPageContent | null>(cachedServicesContent)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    cachedServicesContent ? 'success' : 'loading',
  )
  const [errorMessage, setErrorMessage] = useState('')

  const loadServices = useCallback(async () => {
    setStatus((current) => (current === 'success' ? current : 'loading'))
    setErrorMessage('')

    try {
      const response = await fetch('/api/services')
      const result = await readApiResponse<{
        servicesPage?: ServicesPageContent | null
        message?: string
      }>(response)

      if (!response.ok) {
        throw new Error(result.message || 'Services content could not be loaded.')
      }

      cachedServicesContent = result.servicesPage || null
      setContent(cachedServicesContent)
      setStatus('success')
    } catch (error) {
      setStatus(content ? 'success' : 'error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Services content could not be loaded.',
      )
    }
  }, [content])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const hasContent =
    Boolean(content?.services?.subtitle || content?.services?.items?.length) ||
    Boolean(content?.industries?.subtitle || content?.industries?.items?.length) ||
    Boolean(
      content?.pastProjects?.subtitle ||
        typeof content?.pastProjects?.completedCount === 'number',
    )

  return (
    <main className="page services-page">
      <section className="page-section services-page-section">
        <div className="services-intro">
          <p className="eyebrow">Services</p>
          <h1>Our Services</h1>
          <p>Explore what we provide, who we serve, and the work we have completed.</p>
        </div>

        {status === 'loading' ? <p className="projects-status">Loading services...</p> : null}

        {status === 'error' ? (
          <div className="projects-status error">
            <p>Services content could not be loaded from Sanity right now.</p>
            {errorMessage ? <small>{errorMessage}</small> : null}
            <button type="button" onClick={loadServices}>
              Retry
            </button>
          </div>
        ) : null}

        {status === 'success' && !hasContent ? (
          <p className="projects-status">Services page content has not been added yet.</p>
        ) : null}

        {status === 'success' && content ? (
          <>
            <ContentListSection title="What We Do" section={content.services} />
            <ContentListSection title="Who We Serve" section={content.industries} />

            {content.pastProjects?.subtitle ||
            typeof content.pastProjects?.completedCount === 'number' ? (
              <section className="past-projects-callout">
                <div>
                  <h2>Past Projects</h2>
                  {content.pastProjects.subtitle ? <p>{content.pastProjects.subtitle}</p> : null}
                </div>
                <div className="past-projects-summary">
                  {typeof content.pastProjects.completedCount === 'number' ? (
                    <strong>{content.pastProjects.completedCount}+</strong>
                  ) : null}
                  <Link className="page-button" to="/projects">
                    View Past Projects
                  </Link>
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </section>
    </main>
  )
}

export default Services
