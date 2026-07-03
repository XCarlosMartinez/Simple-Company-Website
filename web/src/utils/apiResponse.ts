export async function readApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || ''
  const body = await response.text()

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(body) as T
    } catch {
      throw new Error('The server returned invalid JSON.')
    }
  }

  const message = body.trim().replace(/\s+/g, ' ').slice(0, 220)
  throw new Error(message || `The server returned a non-JSON response with status ${response.status}.`)
}
