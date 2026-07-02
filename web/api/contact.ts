type ContactBody = {
  firstName?: unknown
  lastName?: unknown
  email?: unknown
  phone?: unknown
  company?: unknown
  comments?: unknown
  captchaToken?: unknown
}

type ContactValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  comments: string
  captchaToken: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+\d().\-\s]{7,24}$/

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeBody(body: ContactBody): ContactValues {
  return {
    firstName: asString(body.firstName),
    lastName: asString(body.lastName),
    email: asString(body.email),
    phone: asString(body.phone),
    company: asString(body.company),
    comments: asString(body.comments),
    captchaToken: asString(body.captchaToken),
  }
}

function validate(values: ContactValues) {
  const errors: string[] = []
  const phoneDigits = values.phone.replace(/\D/g, '')

  if (!values.firstName) errors.push('First name is required.')
  if (!values.lastName) errors.push('Last name is required.')
  if (!values.email || !emailPattern.test(values.email)) errors.push('A valid email is required.')
  if (!values.phone || !phonePattern.test(values.phone) || phoneDigits.length < 7) {
    errors.push('A valid phone number is required.')
  }
  if (!values.comments || values.comments.length < 10) {
    errors.push('Questions/comments must be at least 10 characters.')
  }
  if (!values.captchaToken) errors.push('Captcha is required.')

  return errors
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function verifyCaptcha(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    throw new Error('Captcha is not configured.')
  }

  const formData = new FormData()
  formData.append('secret', secret)
  formData.append('response', token)
  if (remoteIp) {
    formData.append('remoteip', remoteIp)
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  })
  const result = (await response.json()) as {success?: boolean}

  return Boolean(result.success)
}

async function sendEmail(values: ContactValues) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !to || !from) {
    throw new Error('Email delivery is not configured.')
  }

  const companyLine = values.company ? `<p><strong>Company:</strong> ${escapeHtml(values.company)}</p>` : ''

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: values.email,
      subject: `New contact form submission from ${values.firstName} ${values.lastName}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${escapeHtml(values.firstName)} ${escapeHtml(values.lastName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(values.phone)}</p>
        ${companyLine}
        <p><strong>Questions/Comments:</strong></p>
        <p>${escapeHtml(values.comments).replace(/\n/g, '<br />')}</p>
      `,
    }),
  })

  if (!response.ok) {
    throw new Error('Resend could not send the email.')
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({message: 'Method not allowed.'})
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const values = normalizeBody(body || {})
    const validationErrors = validate(values)

    if (validationErrors.length > 0) {
      return res.status(400).json({message: validationErrors[0]})
    }

    const remoteIp =
      typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0]
        : undefined
    const captchaValid = await verifyCaptcha(values.captchaToken, remoteIp)

    if (!captchaValid) {
      return res.status(400).json({message: 'Captcha verification failed.'})
    }

    await sendEmail(values)

    return res.status(200).json({message: 'Message sent.'})
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to send your message right now.'

    return res.status(500).json({message})
  }
}
