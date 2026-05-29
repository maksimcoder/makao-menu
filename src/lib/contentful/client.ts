import { createClient, type ContentfulClientApi } from 'contentful'
import { getContentfulConfig } from './config'

let client: ContentfulClientApi<undefined> | null = null

export function getContentfulClient(): ContentfulClientApi<undefined> {
  const config = getContentfulConfig()
  if (!config) {
    throw new Error(
      'Contentful не настроен: задайте VITE_CONTENTFUL_SPACE_ID и VITE_CONTENTFUL_DELIVERY_TOKEN в .env.local',
    )
  }

  if (!client) {
    client = createClient({
      space: config.spaceId,
      accessToken: config.accessToken,
      environment: config.environment,
      ...(config.host ? { host: config.host } : {}),
    })
  }

  return client
}

export function resetContentfulClient(): void {
  client = null
}
