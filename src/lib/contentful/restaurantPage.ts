import type { Entry } from 'contentful'
import { getContentfulClient } from './client'
import type { ContentfulAnyEntrySkeleton } from './api'

/** Content model → API identifier (не секреты, меняйте при смене схемы в Contentful). */
export const RESTAURANT_PAGE_CONTENT_TYPE = 'restaurant-page'

/** Field IDs — Contentful → Content model → restaurant-page. */
export const RESTAURANT_PAGE_FIELDS = {
  title: 'title',
  schedule: 'schedule',
  phone: 'phone',
  address: 'address',
  addressLink: 'addressLink',
  instagram: 'instagram',
  slug: 'slug',
} as const

export type RestaurantPageContent = {
  id: string
  title: string
  slug: string
  schedule: string[]
  phone: {
    display: string
    tel: string
  }
  address: {
    text: string
    mapUrl: string
  }
  instagram: {
    handle: string
    url: string
  }
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function parseSchedule(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function toTel(display: string): string {
  const digits = display.replace(/[^\d+]/g, '')
  if (!digits) return ''
  return digits.startsWith('+') ? digits : `+${digits}`
}

function toInstagramUrl(handle: string): string {
  const normalized = handle.replace(/^@/, '').trim()
  if (!normalized) return ''
  if (/^https?:\/\//i.test(normalized)) return normalized
  return `https://instagram.com/${normalized}`
}

/** Маппер Entry restaurant-page → структура для лендинга. */
export function mapRestaurantPageEntry(
  entry: Entry<ContentfulAnyEntrySkeleton, undefined>,
): RestaurantPageContent {
  const f = entry.fields
  const fields = RESTAURANT_PAGE_FIELDS

  const phoneDisplay = asString(f[fields.phone])
  const instagramHandle = asString(f[fields.instagram])

  return {
    id: entry.sys.id,
    title: asString(f[fields.title]),
    slug: asString(f[fields.slug]),
    schedule: parseSchedule(asString(f[fields.schedule])),
    phone: {
      display: phoneDisplay,
      tel: toTel(phoneDisplay),
    },
    address: {
      text: asString(f[fields.address]),
      mapUrl: asString(f[fields.addressLink]),
    },
    instagram: {
      handle: instagramHandle,
      url: toInstagramUrl(instagramHandle),
    },
  }
}

/** Загрузить страницу заведения по slug. */
export async function fetchRestaurantPageBySlug(
  slug: string,
): Promise<RestaurantPageContent | null> {
  if (!slug.trim()) {
    return null
  }

  const client = getContentfulClient()
  const fields = RESTAURANT_PAGE_FIELDS

  const raw = await client.getEntries<ContentfulAnyEntrySkeleton>({
    content_type: RESTAURANT_PAGE_CONTENT_TYPE,
    [`fields.${fields.slug}`]: slug.trim(),
    limit: 1,
  })

  const entry = raw.items[0]
  if (!entry) {
    return null
  }

  return mapRestaurantPageEntry(entry)
}
