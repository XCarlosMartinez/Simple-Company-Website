import {useCallback, useEffect, useState} from 'react'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {urlFor} from '../sanity/image'
import {readApiResponse} from '../utils/apiResponse'

type AboutPageContent = {
  companyName?: string
  mainImage?: SanityImageSource
  heading?: string
  body?: string
}

const fallbackAboutContent: AboutPageContent = {
  companyName: 'Simple Company Website',
  heading: 'About Us',
  body:
    'We are a technology consulting and software solutions partner dedicated to helping businesses solve complex challenges through reliable, scalable, and thoughtful digital experiences.',
}

let cachedAboutContent: AboutPageContent | null = null

function AboutUs() {
  const [content, setContent] = useState<AboutPageContent | null>(cachedAboutContent)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    cachedAboutContent ? 'success' : 'loading',
  )
  const [errorMessage, setErrorMessage] = useState('')

  const loadAboutPage = useCallback(async () => {
    setStatus((current) => (current === 'success' ? current : 'loading'))
    setErrorMessage('')

    try {
      const response = await fetch('/api/about')
      const result = await readApiResponse<{
        aboutPage?: AboutPageContent | null
        message?: string
      }>(response)

      if (!response.ok) {
        throw new Error(result.message || 'About content could not be loaded.')
      }

      cachedAboutContent = result.aboutPage || null
      setContent(cachedAboutContent)
      setStatus('success')
    } catch (error) {
      setStatus(content ? 'success' : 'error')
      setErrorMessage(
        error instanceof Error ? error.message : 'About content could not be loaded.',
      )
    }
  }, [content])

  useEffect(() => {
    loadAboutPage()
  }, [loadAboutPage])

  const displayContent = content || fallbackAboutContent
  const hasSanityContent = Boolean(
    content?.companyName || content?.mainImage || content?.heading || content?.body,
  )

  return (
    <main className="page about-page">
      <div className="page-section about-page-section">
        {status === 'error' ? (
          <div className="projects-status error">
            <p>About content could not be loaded from Sanity right now.</p>
            {errorMessage ? <small>{errorMessage}</small> : null}
            <button type="button" onClick={loadAboutPage}>
              Retry
            </button>
          </div>
        ) : null}

        {status === 'success' && !hasSanityContent ? (
          <p className="projects-status">About page content has not been added yet.</p>
        ) : null}

        <header className="about-page-header">
          <p className="eyebrow">About Us</p>
          <h1>{displayContent.companyName || 'Company Name'}</h1>
        </header>

        <section className="about-content-section">
          <div className="about-image-wrap">
            {displayContent.mainImage ? (
              <img
                src={urlFor(displayContent.mainImage).width(900).height(900).fit('crop').url()}
                alt=""
              />
            ) : (
              <div className="about-image-placeholder" aria-hidden="true" />
            )}
          </div>

          <div className="about-copy">
            <h2>{displayContent.heading || 'About Us'}</h2>
            {displayContent.body ? <p>{displayContent.body}</p> : null}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AboutUs
