import type { Establishment, MenuCategory, MenuSection } from '../types/establishment'

export function getMenuSection(
  establishment: Establishment,
  sectionId: string | undefined,
): MenuSection | undefined {
  const sections = establishment.menu.sections
  if (!sections.length) return undefined

  if (sectionId) {
    const found = sections.find((s) => s.id === sectionId)
    if (found) return found
  }

  const defaultId =
    establishment.defaultMenuSection ??
    establishment.bottomNav.find((item) => item.type === 'menu')?.section ??
    sections[0].id

  return sections.find((s) => s.id === defaultId) ?? sections[0]
}

export function getMenuCategory(
  section: MenuSection,
  categoryId: string | undefined,
): MenuCategory | undefined {
  if (!section.categories.length) return undefined

  if (categoryId) {
    const found = section.categories.find((c) => c.id === categoryId)
    if (found) return found
  }

  return section.categories[0]
}

export function getDefaultMenuQuery(establishment: Establishment): {
  section: string
  category: string
} {
  const section = getMenuSection(establishment, undefined)!
  const category = getMenuCategory(section, undefined)!
  return { section: section.id, category: category.id }
}
