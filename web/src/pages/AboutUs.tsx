import {useCallback, useEffect, useState} from 'react'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {urlFor} from '../sanity/image'

type AboutPageContent = {
  companyName?: string
  mainImage?: SanityImageSource
  heading?: string
  body?: string
}

function AboutUs() {
  const [content, setContent] = useState<AboutPageContent | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const loadAboutPage = useCallback(async () => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/about')
      const result = (await response.json()) as {
        aboutPage?: AboutPageContent | null
        message?: string
      }

      if (!response.ok) {
        throw new Error(result.message || 'About content could not be loaded.')
      }

      setContent(result.aboutPage || null)
      setStatus('success')
    } catch (error) {
      setContent(null)
      setStatus('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'About content could not be loaded.',
      )
    }
  }, [])

  useEffect(() => {
    loadAboutPage()
  }, [loadAboutPage])

  const hasContent = Boolean(
    content?.companyName || content?.mainImage || content?.heading || content?.body,
  )

  return (
    <main className="page about-page">
      <div className="page-section about-page-section">
        {status === 'loading' ? <p className="projects-status">Loading about content...</p> : null}

        {status === 'error' ? (
          <div className="projects-status error">
            <p>About content could not be loaded from Sanity right now.</p>
            {errorMessage ? <small>{errorMessage}</small> : null}
            <button type="button" onClick={loadAboutPage}>
              Retry
            </button>
          </div>
        ) : null}

        {status === 'success' && !hasContent ? (
          <p className="projects-status">About page content has not been added yet.</p>
        ) : null}

        {status === 'success' && content && hasContent ? (
          <>
            <header className="about-page-header">
              <p className="eyebrow">About Us</p>
              <h1>{content.companyName || 'Company Name'}</h1>
            </header>

            <section className="about-content-section">
              <div className="about-image-wrap">
                {content.mainImage ? (
                  <img
                    src={urlFor(content.mainImage).width(900).height(900).fit('crop').url()}
                    alt=""
                  />
                ) : null}
              </div>

              <div className="about-copy">
                <h2>{content.heading || 'About Us'}</h2>
                {content.body ? <p>{content.body}</p> : null}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  )
}

export default AboutUs
