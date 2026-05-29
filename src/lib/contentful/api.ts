import type { Entry, EntryCollection } from 'contentful'
import { getContentfulClient } from './client'
import { getLinkedEntriesFromField } from './links'
import { mapRestaurantEntry, type RestaurantSummary } from './restaurants'

/** Content model → API identifier (не секреты, меняйте при смене схемы в Contentful). */
export const MAIN_PAGE_CONTENT_TYPE = 'main-page'
export const MAIN_PAGE_RESTAURANTS_FIELD = 'restaurant'
/** Глубина resolve links: 1 = прямые ссылки, 2+ = вложенные. */
export const MAIN_PAGE_LINK_INCLUDE_DEPTH = 2

const MAX_INCLUDE_DEPTH = 10

function clampIncludeDepth(depth: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 {
  const n = Math.min(Math.max(Math.trunc(depth), 0), MAX_INCLUDE_DEPTH)
  return n as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

/** Минимальный skeleton для не типизированных entries (тест / прототип). */
export type ContentfulAnyEntrySkeleton = {
  fields: Record<string, unknown>
  contentTypeId: string
}

export type ContentfulPageWithLinkedEntries = {
  page: Entry<ContentfulAnyEntrySkeleton, undefined>
  linked: Entry<ContentfulAnyEntrySkeleton, undefined>[]
  /** Сырой ответ CDA (items + includes) — для отладки. */
  raw: EntryCollection<ContentfulAnyEntrySkeleton, undefined>
}

/**
 * Один запрос к /entries: страница + разрешённые ссылки в includes и в fields.
 *
 * @see https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/include
 * include=1 — только прямые ссылки (restaurant → полные entries в includes.Entry,
 * SDK по умолчанию подставляет их в fields.restaurant).
 */
export async function fetchPageWithLinkedEntries(options?: {
  pageContentType?: string
  linkField?: string
  include?: number
  limit?: number
}): Promise<ContentfulPageWithLinkedEntries | null> {
  const client = getContentfulClient()
  const includeDepth = clampIncludeDepth(
    options?.include ?? MAIN_PAGE_LINK_INCLUDE_DEPTH,
  )

  const raw = await client.getEntries<ContentfulAnyEntrySkeleton>({
    content_type: options?.pageContentType ?? MAIN_PAGE_CONTENT_TYPE,
    include: includeDepth,
    limit: options?.limit ?? 1,
  })

  const page = raw.items[0]
  if (!page) {
    return null
  }

  const linked = getLinkedEntriesFromField(
    raw,
    page,
    options?.linkField ?? MAIN_PAGE_RESTAURANTS_FIELD,
  )

  return { page, linked, raw }
}

export type MainPageContent = {
  pageTitle: string
  restaurants: RestaurantSummary[]
}

/** Получить список ресторанов с главной страницы в плоском виде для UI. */
export async function fetchMainPageRestaurants(): Promise<MainPageContent> {
  const mainPage = await fetchPageWithLinkedEntries()
  if (!mainPage) {
    return { pageTitle: '', restaurants: [] }
  }
  return {
    pageTitle:
      typeof mainPage.page.fields.title === 'string'
        ? mainPage.page.fields.title
        : '',
    restaurants: mainPage.linked.map(mapRestaurantEntry),
  }
}
