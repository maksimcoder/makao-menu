import { proxyContentfulImage } from './_lib/contentfulImageProxy'

export const config = { runtime: 'edge' }

const INTERNAL_PARAMS = new Set(['region', 'asset'])

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const region = url.searchParams.get('region')
  const asset = url.searchParams.get('asset')

  if (!asset) {
    return new Response('Bad request', { status: 400 })
  }

  const upstreamHost =
    region === 'eu' ? 'images.eu.ctfassets.net' : 'images.ctfassets.net'
  const assetPath = `/${asset}`

  const upstreamParams = new URLSearchParams()
  for (const [key, value] of url.searchParams) {
    if (!INTERNAL_PARAMS.has(key)) {
      upstreamParams.set(key, value)
    }
  }

  const search = upstreamParams.size ? `?${upstreamParams.toString()}` : ''

  return proxyContentfulImage(upstreamHost, assetPath, search)
}
