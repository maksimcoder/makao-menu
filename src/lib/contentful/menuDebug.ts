import type { EntryCollection } from 'contentful'
import { getContentfulClient } from './client'
import type { ContentfulAnyEntrySkeleton } from './api'
import {
  RESTAURANT_PAGE_CONTENT_TYPE,
  RESTAURANT_PAGE_FIELDS,
} from './restaurantPage'

/** Content model API identifiers (сверено с CMS). */
export const MENU_CONTENT_TYPES = {
  item: 'menu-item',
  group: 'menu-group',
  category: 'menu-category',
  section: 'menu-section',
  bottomNavButton: 'bottom-nav-button',
} as const

/**
 * Field IDs на restaurant-page для меню.
 * TODO: привязать entries на titki-bar и подтвердить имена полей.
 */
export const RESTAURANT_PAGE_MENU_FIELDS = {
  menuSections: 'menuSections',
  bottomNav: 'bottomNav',
  defaultMenuSection: 'defaultMenuSection',
} as const

export const MENU_SECTION_FIELDS = {
  title: 'title',
  slug: 'slug',
  categories: 'categories',
} as const

/** У menu-category ссылки на menu-group лежат в поле categories (не groups). */
export const MENU_CATEGORY_FIELDS = {
  title: 'title',
  slug: 'slug',
  icon: 'icon',
  order: 'order',
  groups: 'categories',
} as const

export const MENU_GROUP_FIELDS = {
  title: 'title',
  order: 'order',
  items: 'items',
} as const

export const MENU_ITEM_FIELDS = {
  title: 'title',
  description: 'description',
  price: 'price',
  image: 'image',
} as const

export const BOTTOM_NAV_BUTTON_FIELDS = {
  label: 'label',
  navId: 'navId',
  slug: 'slug',
  type: 'type',
  visible: 'Visible',
  order: 'order',
  section: 'section',
} as const

const MAX_INCLUDE_DEPTH = 10

function clampIncludeDepth(depth: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 {
  const n = Math.min(Math.max(Math.trunc(depth), 0), MAX_INCLUDE_DEPTH)
  return n as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

/** restaurant-page → menuSections → category → group → item */
export const MENU_TREE_INCLUDE_DEPTH = 4

export async function fetchRestaurantMenuTreeRaw(
  restaurantSlug: string,
  include = MENU_TREE_INCLUDE_DEPTH,
): Promise<EntryCollection<ContentfulAnyEntrySkeleton, undefined> | null> {
  if (!restaurantSlug.trim()) return null

  const client = getContentfulClient()

  return client.getEntries<ContentfulAnyEntrySkeleton>({
    content_type: RESTAURANT_PAGE_CONTENT_TYPE,
    [`fields.${RESTAURANT_PAGE_FIELDS.slug}`]: restaurantSlug.trim(),
    include: clampIncludeDepth(include),
    limit: 1,
  })
}

export async function fetchMenuSectionTreeRaw(
  sectionSlug: string,
  include = 3,
): Promise<EntryCollection<ContentfulAnyEntrySkeleton, undefined> | null> {
  if (!sectionSlug.trim()) return null

  const client = getContentfulClient()

  return client.getEntries<ContentfulAnyEntrySkeleton>({
    content_type: MENU_CONTENT_TYPES.section,
    [`fields.${MENU_SECTION_FIELDS.slug}`]: sectionSlug.trim(),
    include: clampIncludeDepth(include),
    limit: 1,
  })
}

export async function fetchContentTypeEntriesRaw(
  contentType: string,
  limit = 50,
  include = 0,
): Promise<EntryCollection<ContentfulAnyEntrySkeleton, undefined>> {
  const client = getContentfulClient()

  return client.getEntries<ContentfulAnyEntrySkeleton>({
    content_type: contentType,
    include: clampIncludeDepth(include),
    limit,
  })
}

export const MENU_DEBUG_QUERIES = {
  fullTree: "await __contentful.fetchRestaurantMenuTreeRaw('titki-bar')",
  section: "await __contentful.fetchMenuSectionTreeRaw('bar')",
  bottomNavButtons:
    "await __contentful.fetchContentTypeEntriesRaw('bottom-nav-button', 50, 1)",
  menuSections: `await __contentful.fetchContentTypeEntriesRaw('${MENU_CONTENT_TYPES.section}', 50, 3)`,
  menuCategories: `await __contentful.fetchContentTypeEntriesRaw('${MENU_CONTENT_TYPES.category}', 50, 2)`,
  menuGroups: `await __contentful.fetchContentTypeEntriesRaw('${MENU_CONTENT_TYPES.group}', 50, 1)`,
  menuItems: `await __contentful.fetchContentTypeEntriesRaw('${MENU_CONTENT_TYPES.item}', 50, 0)`,
} as const
