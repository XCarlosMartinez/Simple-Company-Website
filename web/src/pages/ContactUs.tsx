import {useEffect, useRef, useState} from 'react'
import type {ChangeEvent, FormEvent} from 'react'

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  comments: string
}

type FieldErrors = Partial<Record<keyof FormValues | 'captcha', string>>

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback': () => void
          'error-callback': () => void
        },
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const initialValues: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  comments: '',
}

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

function validateForm(values: FormValues, captchaToken: string): FieldErrors {
  const errors: FieldErrors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phonePattern = /^[+\d().\-\s]{7,24}$/
  const phoneDigits = values.phone.replace(/\D/g, '')

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required.'
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required.'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!phonePattern.test(values.phone.trim()) || phoneDigits.length < 7) {
    errors.phone = 'Enter a valid phone number.'
  }

  if (!values.comments.trim()) {
    errors.comments = 'Questions or comments are required.'
  } else if (values.comments.trim().length < 10) {
    errors.comments = 'Please include at least 10 characters.'
  }

  if (!captchaToken) {
    errors.captcha = 'Please complete the captcha.'
  }

  return errors
}

function FormError({id, message}: {id: string; message?: string}) {
  return (
    <small className="form-message" id={id} aria-hidden={!message}>
      {message || ''}
    </small>
  )
}

function ContactUs() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [captchaToken, setCaptchaToken] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  )
  const [statusMessage, setStatusMessage] = useState('')
  const captchaRef = useRef<HTMLDivElement>(null)
  const captchaWidgetId = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!turnstileSiteKey || !captchaRef.current) {
      return
    }

    const renderCaptcha = () => {
      if (!captchaRef.current || !window.turnstile || captchaWidgetId.current) {
        return
      }

      captchaWidgetId.current = window.turnstile.render(captchaRef.current, {
        sitekey: turnstileSiteKey,
        callback: setCaptchaToken,
        'expired-callback': () => setCaptchaToken(''),
        'error-callback': () => setCaptchaToken(''),
      })
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]',
    )

    if (window.turnstile) {
      renderCaptcha()
    } else if (existingScript) {
      existingScript.addEventListener('load', renderCaptcha)
    } else {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.addEventListener('load', renderCaptcha)
      document.body.appendChild(script)
    }

    return () => {
      if (captchaWidgetId.current && window.turnstile) {
        window.turnstile.remove(captchaWidgetId.current)
        captchaWidgetId.current = undefined
      }
    }
  }, [])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {name, value} = event.target
    setValues((currentValues) => ({...currentValues, [name]: value}))
    setErrors((currentErrors) => ({...currentErrors, [name]: undefined}))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateForm(values, captchaToken)

    setErrors(nextErrors)
    setStatusMessage('')

    if (Object.keys(nextErrors).length > 0) {
      setSubmitStatus('idle')
      return
    }

    setSubmitStatus('submitting')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...values, captchaToken}),
      })
      const result = (await response.json()) as {message?: string}

      if (!response.ok) {
        throw new Error(result.message || 'Unable to send your message.')
      }

      setValues(initialValues)
      setCaptchaToken('')
      window.turnstile?.reset(captchaWidgetId.current)
      setSubmitStatus('success')
      setStatusMessage('Thanks. Your message has been sent.')
    } catch (error) {
      setSubmitStatus('error')
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      )
    }
  }

  return (
    <main className="page contact-page">
      <section className="page-section contact-section">
        <div className="contact-intro">
          <p className="eyebrow">Contact Us</p>
          <h1>Tell us how we can help.</h1>
          <p>
            Send us a few details and we will get back to you as soon as possible.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <label className="form-field">
              <span>First Name</span>
              <input
                autoComplete="given-name"
                name="firstName"
                onChange={handleChange}
                type="text"
                value={values.firstName}
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
              <FormError id="firstName-error" message={errors.firstName} />
            </label>

            <label className="form-field">
              <span>Last Name</span>
              <input
                autoComplete="family-name"
                name="lastName"
                onChange={handleChange}
                type="text"
                value={values.lastName}
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
              <FormError id="lastName-error" message={errors.lastName} />
            </label>

            <label className="form-field">
              <span>Email</span>
              <input
                autoComplete="email"
                name="email"
                onChange={handleChange}
                type="email"
                value={values.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              <FormError id="email-error" message={errors.email} />
            </label>

            <label className="form-field">
              <span>Phone</span>
              <input
                autoComplete="tel"
                name="phone"
                onChange={handleChange}
                type="tel"
                value={values.phone}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              <FormError id="phone-error" message={errors.phone} />
            </label>

            <label className="form-field form-field-wide">
              <span>Company</span>
              <input
                autoComplete="organization"
                name="company"
                onChange={handleChange}
                type="text"
                value={values.company}
              />
              <FormError id="company-error" />
            </label>

            <label className="form-field form-field-wide">
              <span>Questions/Comments</span>
              <textarea
                name="comments"
                onChange={handleChange}
                rows={7}
                value={values.comments}
                aria-invalid={Boolean(errors.comments)}
                aria-describedby={errors.comments ? 'comments-error' : undefined}
              />
              <FormError id="comments-error" message={errors.comments} />
            </label>
          </div>

          <div className="captcha-wrap">
            {turnstileSiteKey ? (
              <div ref={captchaRef} />
            ) : (
              <p className="form-warning">Captcha is not configured yet.</p>
            )}
            {errors.captcha ? <small>{errors.captcha}</small> : null}
          </div>

          <button className="submit-button" disabled={submitStatus === 'submitting'} type="submit">
            {submitStatus === 'submitting' ? 'Sending...' : 'Submit'}
          </button>

          {statusMessage ? (
            <p className={`form-status ${submitStatus}`} role="status">
              {statusMessage}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  )
}

export default ContactUs
