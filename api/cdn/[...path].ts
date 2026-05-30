import {
  extractAssetPath,
  proxyContentfulImage,
} from '../_lib/contentfulImageProxy'

export const config = { runtime: 'edge' }

export default async function handler(request: Request): Promise<Response> {
  const assetPath = extractAssetPath(request, '/api/cdn')
  return proxyContentfulImage(request, 'images.ctfassets.net', assetPath)
}
