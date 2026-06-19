import type { Asset, Entry } from 'contentful'
import type { ContentfulAnyEntrySkeleton } from './api'
import { getContentfulClient } from './client'
import { buildContentfulImageUrl } from './imageProxy'
import {
  RESTAURANT_PAGE_CONTENT_TYPE,
  RESTAURANT_PAGE_FIELDS,
} from './restaurantPage'
import {
  BOTTOM_NAV_BUTTON_FIELDS,
  MENU_CATEGORY_FIELDS,
  MENU_GROUP_FIELDS,
  MENU_ITEM_FIELDS,
  MENU_SECTION_FIELDS,
  MENU_TREE_INCLUDE_DEPTH,
  RESTAURANT_PAGE_MENU_FIELDS,
} from './menuDebug'
import type {
  BottomNavItem,
  CategoryIconId,
  Establishment,
  MenuCategory,
  MenuGroup,
  MenuItem,
  MenuSection,
} from '../../types/establishment'

const MENU_ITEM_CURRENCY = 'руб.'
const CATEGORY_ICONS: CategoryIconId[] = [
  'cocktail',
  'lemonade',
  'wine',
  'whiskey',
  'spirits',
  'cognac',
  'hookah',
  'dessert',
  'coffee',
]

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number.parseInt(value, 10)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function isResolvedEntry(
  value: unknown,
): value is Entry<ContentfulAnyEntrySkeleton, undefined> {
  if (!value || typeof value !== 'object') return false
  const sys = (value as Entry<ContentfulAnyEntrySkeleton, undefined>).sys
  return sys?.type === 'Entry'
}

function toEntryList(
  value: unknown,
): Entry<ContentfulAnyEntrySkeleton, undefined>[] {
  if (isResolvedEntry(value)) return [value]
  if (Array.isArray(value)) {
    return value.filter(isResolvedEntry)
  }
  return []
}

function sortByOrderField(
  entries: Entry<ContentfulAnyEntrySkeleton, undefined>[],
  orderField: string,
): Entry<ContentfulAnyEntrySkeleton, undefined>[] {
  return [...entries].sort((a, b) => {
    const ao = asNumber(a.fields[orderField])
    const bo = asNumber(b.fields[orderField])
    const aOrder = ao || 999
    const bOrder = bo || 999
    return aOrder - bOrder
  })
}

function normalizeAssetUrl(url: string | undefined): string | null {
  if (!url) return null
  if (url.startsWith('//')) return `https:${url}`
  return url
}

function extractMenuItemImage(asset: unknown): string {
  if (!asset || typeof asset !== 'object') return ''
  const a = asset as Asset
  const rawUrl = normalizeAssetUrl(a.fields?.file?.url as string | undefined)
  if (!rawUrl) return ''
  return buildContentfulImageUrl(rawUrl, {
    width: 800,
    format: 'webp',
    quality: 85,
    fit: 'fill',
  })
}

function parseCategoryIcon(value: unknown): CategoryIconId {
  const icon = asString(value)
  if (CATEGORY_ICONS.includes(icon as CategoryIconId)) {
    return icon as CategoryIconId
  }
  return 'cocktail'
}

function mapMenuItem(
  entry: Entry<ContentfulAnyEntrySkeleton, undefined>,
): MenuItem {
  const f = entry.fields
  const fields = MENU_ITEM_FIELDS

  return {
    id: entry.sys.id,
    name: asString(f[fields.title]),
    description: asString(f[fields.description]) || undefined,
    price: asNumber(f[fields.price]),
    currency: MENU_ITEM_CURRENCY,
    image: extractMenuItemImage(f[fields.image]),
  }
}

function mapMenuGroup(
  entry: Entry<ContentfulAnyEntrySkeleton, undefined>,
): MenuGroup {
  const f = entry.fields
  const items = toEntryList(f[MENU_GROUP_FIELDS.items]).map(mapMenuItem)

  return {
    id: entry.sys.id,
    label: asString(f[MENU_GROUP_FIELDS.title]),
    items,
  }
}

function mapMenuCategory(
  entry: Entry<ContentfulAnyEntrySkeleton, undefined>,
): MenuCategory {
  const f = entry.fields
  const fields = MENU_CATEGORY_FIELDS
  const groups = sortByOrderField(
    toEntryList(f[fields.groups]),
    fields.order,
  ).map(mapMenuGroup)

  return {
    id: asString(f[fields.slug]) || entry.sys.id,
    label: asString(f[fields.title]),
    icon: parseCategoryIcon(f[fields.icon]),
    groups,
  }
}

function mapMenuSection(
  entry: Entry<ContentfulAnyEntrySkeleton, undefined>,
): MenuSection {
  const f = entry.fields
  const fields = MENU_SECTION_FIELDS
  const categories = sortByOrderField(
    toEntryList(f[fields.categories]),
    MENU_CATEGORY_FIELDS.order,
  ).map(mapMenuCategory)

  return {
    id: asString(f[fields.slug]) || entry.sys.id,
    label: asString(f[fields.title]),
    categories,
  }
}

function mapBottomNavButton(
  entry: Entry<ContentfulAnyEntrySkeleton, undefined>,
): BottomNavItem | null {
  const f = entry.fields
  const fields = BOTTOM_NAV_BUTTON_FIELDS

  if (f[fields.visible] === false) {
    return null
  }

  const type = asString(f[fields.type])
  if (type !== 'home' && type !== 'menu') {
    return null
  }

  const navId =
    asString(f[fields.navId]) ||
    asString(f[fields.slug]) ||
    entry.sys.id

  const item: BottomNavItem = {
    id: navId,
    label: asString(f[fields.label]),
    type,
  }

  if (type === 'menu') {
    const sectionEntry: unknown = f[fields.section]
    if (isResolvedEntry(sectionEntry)) {
      item.section =
        asString(sectionEntry.fields[MENU_SECTION_FIELDS.slug]) ||
        navId
    } else {
      item.section = navId
    }
  }

  return item
}

/** Маппер restaurant-page → Establishment (меню + нижняя навигация). */
export function mapRestaurantMenuEntry(
  entry: Entry<ContentfulAnyEntrySkeleton, undefined>,
): Establishment {
  const f = entry.fields
  const menuFields = RESTAURANT_PAGE_MENU_FIELDS
  const slug = asString(f[RESTAURANT_PAGE_FIELDS.slug])

  const sections = toEntryList(f[menuFields.menuSections]).map(mapMenuSection)

  const bottomNav = sortByOrderField(
    toEntryList(f[menuFields.bottomNav]),
    BOTTOM_NAV_BUTTON_FIELDS.order,
  )
    .map(mapBottomNavButton)
    .filter((item): item is BottomNavItem => item !== null)

  const defaultMenuSection =
    asString(f[menuFields.defaultMenuSection]) ||
    bottomNav.find((item) => item.type === 'menu')?.section ||
    sections[0]?.id

  return {
    slug,
    brand: {
      name: asString(f[RESTAURANT_PAGE_FIELDS.title]),
      subtitle: '',
    },
    defaultMenuSection,
    landing: {
      schedule: [],
      phone: { display: '', tel: '' },
      instagram: { handle: '', url: '' },
      address: { text: '', mapUrl: '' },
      amenities: [],
    },
    bottomNav,
    menu: { sections },
  }
}

/** Загрузить меню заведения по slug. */
export async function fetchRestaurantMenuBySlug(
  slug: string,
): Promise<Establishment | null> {
  if (!slug.trim()) return null

  const client = getContentfulClient()
  const raw = await client.getEntries<ContentfulAnyEntrySkeleton>({
    content_type: RESTAURANT_PAGE_CONTENT_TYPE,
    [`fields.${RESTAURANT_PAGE_FIELDS.slug}`]: slug.trim(),
    include: MENU_TREE_INCLUDE_DEPTH,
    limit: 1,
  })

  const entry = raw.items[0]
  if (!entry) return null

  return mapRestaurantMenuEntry(entry)
}
