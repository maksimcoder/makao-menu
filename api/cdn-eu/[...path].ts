import {
  extractAssetPath,
  proxyContentfulImage,
} from '../_lib/contentfulImageProxy'

export const config = { runtime: 'edge' }

export default async function handler(request: Request): Promise<Response> {
  const assetPath = extractAssetPath(request, '/api/cdn-eu')
  return proxyContentfulImage(request, 'images.eu.ctfassets.net', assetPath)
}
