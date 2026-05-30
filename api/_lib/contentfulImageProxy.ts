const ALLOWED_HOSTS = new Set([
  'images.ctfassets.net',
  'images.eu.ctfassets.net',
])

export async function proxyContentfulImage(
  request: Request,
  upstreamHost: string,
  assetPath: string,
): Promise<Response> {
  if (!ALLOWED_HOSTS.has(upstreamHost)) {
    return new Response('Forbidden', { status: 403 })
  }

  const spaceId = process.env.CONTENTFUL_SPACE_ID?.trim()
  const pathSpaceId = assetPath.split('/').filter(Boolean)[0]
  if (spaceId && pathSpaceId !== spaceId) {
    return new Response('Forbidden', { status: 403 })
  }

  const { search } = new URL(request.url)
  const target = `https://${upstreamHost}${assetPath}${search}`

  const upstream = await fetch(target, {
    headers: { Accept: 'image/*' },
  })

  if (!upstream.ok) {
    return new Response('Not found', { status: upstream.status })
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('Content-Type') ?? 'application/octet-stream',
      'Cache-Control':
        'public, s-maxage=31536000, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

export function extractAssetPath(request: Request, routePrefix: string): string {
  const url = new URL(request.url)
  const escaped = routePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = url.pathname.match(new RegExp(`^${escaped}/(.*)`))
  return '/' + (match?.[1] ?? '')
}
