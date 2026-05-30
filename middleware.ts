import { proxyContentfulImageFromUrl } from './api/_lib/contentfulImageProxy'

export const config = {
  matcher: ['/cdn/:path*', '/cdn-eu/:path*'],
}

export default function middleware(request: Request): Promise<Response> {
  return proxyContentfulImageFromUrl(request)
}
