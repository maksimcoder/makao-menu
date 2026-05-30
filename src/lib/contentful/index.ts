export {
  getContentfulConfig,
  isContentfulConfigured,
  type ContentfulConfig,
} from './config'
export { getContentfulClient, resetContentfulClient } from './client'
export { getLinkedEntriesFromField } from './links'
export {
  fetchPageWithLinkedEntries,
  fetchMainPageRestaurants,
  MAIN_PAGE_CONTENT_TYPE,
  MAIN_PAGE_RESTAURANTS_FIELD,
  MAIN_PAGE_LINK_INCLUDE_DEPTH,
  type ContentfulAnyEntrySkeleton,
  type ContentfulPageWithLinkedEntries,
  type MainPageContent,
} from './api'
export {
  mapRestaurantEntry,
  buildThumbnailUrl,
  type RestaurantSummary,
} from './restaurants'
export {
  buildContentfulImageUrl,
  toProxiedImageUrl,
  type ContentfulImageOptions,
} from './imageProxy'
