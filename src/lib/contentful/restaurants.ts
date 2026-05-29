import type { Asset, Entry } from 'contentful'
import type { ContentfulAnyEntrySkeleton } from './api'

export type RestaurantSummary = {
  id: string
  title: string
  slug: string
  schedule: string
  phone: string
  instagram: string
  address: string
  thumbnail: {
    url: string
    alt: string
    width?: number
    height?: number
  } | null
}

function normalizeAssetUrl(url: string | undefined): string | null {
  if (!url) return null
  if (url.startsWith('//')) return `https:${url}`
  return url
}

/**
 * Возвращает уменьшенную картинку через Contentful Images API.
 * @see https://www.contentful.com/developers/docs/references/images-api/
 */
export function buildThumbnailUrl(url: string, width = 240): string {
  const u = new URL(url)
  u.searchParams.set('w', String(width))
  u.searchParams.set('fm', 'webp')
  u.searchParams.set('q', '80')
  u.searchParams.set('fit', 'fill')
  return u.toString()
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function extractThumbnail(
  asset: unknown,
): RestaurantSummary['thumbnail'] {
  if (!asset || typeof asset !== 'object') return null
  const a = asset as Asset
  const file = a.fields?.file
  const rawUrl = normalizeAssetUrl(file?.url as string | undefined)
  if (!rawUrl) return null

  const details = file?.details as
    | { image?: { width?: number; height?: number } }
    | undefined

  return {
    url: buildThumbnailUrl(rawUrl, 240),
    alt: asString(a.fields?.title) || asString(a.fields?.description),
    width: details?.image?.width,
    height: details?.image?.height,
  }
}

/** Маппер Entry main-rest-block → плоская структура для UI. */
export function mapRestaurantEntry(
  entry: Entry<ContentfulAnyEntrySkeleton, undefined>,
): RestaurantSummary {
  const f = entry.fields
  return {
    id: entry.sys.id,
    title: asString(f.title),
    slug: asString(f.slug),
    schedule: asString(f.schedule),
    phone: asString(f.phone),
    instagram: asString(f.instagram),
    address: asString(f.address),
    thumbnail: extractThumbnail(f.thumbnail),
  }
}
