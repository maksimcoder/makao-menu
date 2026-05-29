import type { Entry, EntryCollection, UnresolvedLink } from 'contentful'
import type { ContentfulAnyEntrySkeleton } from './api'

type EntryLink = UnresolvedLink<'Entry'>

function isResolvedEntry(
  value: EntryLink | Entry<ContentfulAnyEntrySkeleton, undefined>,
): value is Entry<ContentfulAnyEntrySkeleton, undefined> {
  return 'fields' in value && value.fields != null
}

/**
 * Извлекает связанные entries из поля (массив ссылок или уже разрешённые SDK объекты).
 * Работает после getEntries({ include: N }) — см. Content Delivery API, параметр include.
 */
export function getLinkedEntriesFromField(
  collection: EntryCollection<ContentfulAnyEntrySkeleton, undefined>,
  parent: Entry<ContentfulAnyEntrySkeleton, undefined>,
  fieldName: string,
): Entry<ContentfulAnyEntrySkeleton, undefined>[] {
  const field = parent.fields[fieldName] as
    | Array<EntryLink | Entry<ContentfulAnyEntrySkeleton, undefined>>
    | undefined
  if (!field?.length) {
    return []
  }

  if (isResolvedEntry(field[0])) {
    return field.filter(isResolvedEntry)
  }

  const includes = collection.includes?.Entry ?? []
  return (field as EntryLink[])
    .map((link) => includes.find((entry) => entry.sys.id === link.sys.id))
    .filter((entry): entry is Entry<ContentfulAnyEntrySkeleton, undefined> =>
      Boolean(entry),
    )
}
