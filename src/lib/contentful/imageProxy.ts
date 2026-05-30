const CONTENTFUL_IMAGE_HOSTS = {
  'images.ctfassets.net': '/cdn',
  'images.eu.ctfassets.net': '/cdn-eu',
} as const

export type ContentfulImageOptions = {
  width?: number
  quality?: number
  format?: 'webp' | 'jpg' | 'png' | 'avif'
  fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb'
}

export function toProxiedImageUrl(url: string): string {
  const useProxy = import.meta.env.VITE_USE_IMAGE_PROXY !== 'false'
  if (!useProxy) return url

  const u = new URL(url)
  const prefix =
    CONTENTFUL_IMAGE_HOSTS[u.hostname as keyof typeof CONTENTFUL_IMAGE_HOSTS]
  if (!prefix) return url

  return `${prefix}${u.pathname}${u.search}`
}

/** Универсальный builder — для thumbnails, menu cards и любых будущих картинок. */
export function buildContentfulImageUrl(
  rawUrl: string,
  opts: ContentfulImageOptions = {},
): string {
  const u = new URL(rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl)
  if (opts.width) u.searchParams.set('w', String(opts.width))
  if (opts.format) u.searchParams.set('fm', opts.format)
  if (opts.quality) u.searchParams.set('q', String(opts.quality))
  if (opts.fit) u.searchParams.set('fit', opts.fit)
  return toProxiedImageUrl(u.toString())
}
