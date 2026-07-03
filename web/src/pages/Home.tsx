import {useCallback, useEffect, useMemo, useState} from 'react'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {Link} from 'react-router-dom'
import {urlFor} from '../sanity/image'

type Cta = {
  label?: string
  href?: string
}

type HomePageContent = {
  hero?: {
    eyebrow?: string
    headline?: string
    subtitle?: string
    primaryCta?: Cta
    secondaryCta?: Cta
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
    button?: Cta
  }
}

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
}

type Project = {
  _id: string
  title: string
  slug: string
  mainImage?: SanityImageSource
  description: string
}

const fallbackHomePage: HomePageContent = {
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

let cachedHomePage: HomePageContent | null = null
let cachedServicesPage: ServicesPageContent | null = null
let cachedProjects: Project[] = []

function HomeCtaLink({cta, variant = 'primary'}: {cta?: Cta; variant?: 'primary' | 'secondary'}) {
  if (!cta?.label || !cta.href) {
    return null
  }

  return (
    <Link className={variant === 'secondary' ? 'page-button page-button-secondary' : 'page-button'} to={cta.href}>
      {cta.label}
    </Link>
  )
}

function Home() {
  const [homePage, setHomePage] = useState<HomePageContent | null>(cachedHomePage)
  const [servicesPage, setServicesPage] = useState<ServicesPageContent | null>(cachedServicesPage)
  const [projects, setProjects] = useState<Project[]>(cachedProjects)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    cachedHomePage ? 'success' : 'loading',
  )
  const [errorMessage, setErrorMessage] = useState('')

  const loadHomeContent = useCallback(async () => {
    setStatus((current) => (current === 'success' ? current : 'loading'))
    setErrorMessage('')

    try {
      const [homeResponse, servicesResponse, projectsResponse] = await Promise.all([
        fetch('/api/home'),
        fetch('/api/services'),
        fetch('/api/projects'),
      ])

      const homeResult = (await homeResponse.json()) as {
        homePage?: HomePageContent | null
        message?: string
      }
      const servicesResult = (await servicesResponse.json()) as {
        servicesPage?: ServicesPageContent | null
        message?: string
      }
      const projectsResult = (await projectsResponse.json()) as {
        projects?: Project[]
        message?: string
      }

      if (!homeResponse.ok) {
        throw new Error(homeResult.message || 'Home page content could not be loaded.')
      }

      if (!servicesResponse.ok) {
        throw new Error(servicesResult.message || 'Services content could not be loaded.')
      }

      if (!projectsResponse.ok) {
        throw new Error(projectsResult.message || 'Projects could not be loaded.')
      }

      cachedHomePage = homeResult.homePage || null
      cachedServicesPage = servicesResult.servicesPage || null
      cachedProjects = projectsResult.projects || []

      setHomePage(cachedHomePage)
      setServicesPage(cachedServicesPage)
      setProjects(cachedProjects)
      setStatus('success')
    } catch (error) {
      setStatus(homePage ? 'success' : 'error')
      setErrorMessage(
        error instanceof Error ? error.message : 'Home page content could not be loaded.',
      )
    }
  }, [homePage])

  useEffect(() => {
    loadHomeContent()
  }, [loadHomeContent])

  const services = useMemo(() => {
    const limit = (homePage || fallbackHomePage).servicesPreview?.itemLimit || 3
    return servicesPage?.services?.items?.slice(0, limit) || []
  }, [homePage, servicesPage?.services?.items])

  const industries = useMemo(() => {
    const limit = (homePage || fallbackHomePage).industriesPreview?.itemLimit || 4
    return servicesPage?.industries?.items?.slice(0, limit) || []
  }, [homePage, servicesPage?.industries?.items])

  const featuredProjects = useMemo(() => {
    const limit = (homePage || fallbackHomePage).projectsPreview?.itemLimit || 3
    return projects.slice(0, limit)
  }, [homePage, projects])

  const displayedHomePage = homePage || fallbackHomePage

  return (
    <main className="page home-page">
      <section className="page-section home-page-section">
        {status === 'error' ? (
          <div className="projects-status error">
            <p>Home page content could not be loaded from Sanity right now.</p>
            {errorMessage ? <small>{errorMessage}</small> : null}
            <button type="button" onClick={loadHomeContent}>
              Retry
            </button>
          </div>
        ) : null}

        {status === 'success' && !homePage ? (
          <p className="projects-status">Home page content has not been added yet.</p>
        ) : null}

        {status !== 'error' ? (
          <>
            <section className="home-hero">
              <div className="home-hero-copy">
                {displayedHomePage.hero?.eyebrow ? (
                  <p className="eyebrow">{displayedHomePage.hero.eyebrow}</p>
                ) : null}
                {displayedHomePage.hero?.headline ? <h1>{displayedHomePage.hero.headline}</h1> : null}
                {displayedHomePage.hero?.subtitle ? <p>{displayedHomePage.hero.subtitle}</p> : null}
                <div className="home-actions">
                  <HomeCtaLink cta={displayedHomePage.hero?.primaryCta} />
                  <HomeCtaLink cta={displayedHomePage.hero?.secondaryCta} variant="secondary" />
                </div>
              </div>
              <div className="home-hero-panel" aria-hidden="true">
                <span>Strategy</span>
                <span>Design</span>
                <span>Development</span>
                <span>Launch</span>
              </div>
            </section>

            <section className="home-preview-section">
              <div className="home-section-heading">
                <h2>{displayedHomePage.servicesPreview?.title || 'What We Do'}</h2>
                {displayedHomePage.servicesPreview?.subtitle ? (
                  <p>{displayedHomePage.servicesPreview.subtitle}</p>
                ) : null}
              </div>

              {services.length ? (
                <div className="home-card-grid">
                  {services.map((service) => (
                    <article className="home-simple-card" key={service._key}>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </article>
                  ))}
                </div>
              ) : null}

              <Link className="home-text-link" to="/services">
                View all services
              </Link>
            </section>

            <section className="home-preview-section home-preview-band">
              <div className="home-section-heading">
                <h2>{displayedHomePage.projectsPreview?.title || 'Featured Projects'}</h2>
                {displayedHomePage.projectsPreview?.subtitle ? (
                  <p>{displayedHomePage.projectsPreview.subtitle}</p>
                ) : null}
              </div>

              {featuredProjects.length ? (
                <div className="projects-grid">
                  {featuredProjects.map((project) => (
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

              <Link className="home-text-link" to="/projects">
                View all projects
              </Link>
            </section>

            <section className="home-preview-section">
              <div className="home-section-heading">
                <h2>{displayedHomePage.industriesPreview?.title || 'Industries We Serve'}</h2>
                {displayedHomePage.industriesPreview?.subtitle ? (
                  <p>{displayedHomePage.industriesPreview.subtitle}</p>
                ) : null}
              </div>

              {industries.length ? (
                <div className="home-industry-list">
                  {industries.map((industry) => (
                    <span key={industry._key}>{industry.title}</span>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="home-final-cta">
              <div>
                {displayedHomePage.finalCta?.title ? (
                  <h2>{displayedHomePage.finalCta.title}</h2>
                ) : null}
                {displayedHomePage.finalCta?.subtitle ? (
                  <p>{displayedHomePage.finalCta.subtitle}</p>
                ) : null}
              </div>
              <HomeCtaLink cta={displayedHomePage.finalCta?.button} />
            </section>
          </>
        ) : null}
      </section>
    </main>
  )
}

export default Home
