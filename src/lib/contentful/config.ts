export type ContentfulConfig = {
  spaceId: string
  accessToken: string
  environment: string
  host?: string
}

export function getContentfulConfig(): ContentfulConfig | null {
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID?.trim()
  const accessToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN?.trim()
  const environment =
    import.meta.env.VITE_CONTENTFUL_ENVIRONMENT?.trim() || 'master'
  const host = import.meta.env.VITE_CONTENTFUL_HOST?.trim()

  if (!spaceId || !accessToken) {
    return null
  }

  return {
    spaceId,
    accessToken,
    environment,
    ...(host ? { host } : {}),
  }
}

export function isContentfulConfigured(): boolean {
  return getContentfulConfig() !== null
}
