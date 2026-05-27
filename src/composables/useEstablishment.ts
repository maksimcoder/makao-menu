import { ref, watch, type Ref } from 'vue'
import type { Establishment } from '../types/establishment'

const cache = new Map<string, Establishment>()

export function useEstablishment(slug: Ref<string> | string) {
  const data = ref<Establishment | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const load = async (establishmentSlug: string) => {
    if (!establishmentSlug) {
      data.value = null
      error.value = 'Заведение не указано'
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    const cached = cache.get(establishmentSlug)
    if (cached) {
      data.value = cached
      loading.value = false
      return
    }

    try {
      const response = await fetch(`/data/${establishmentSlug}.json`)
      if (!response.ok) {
        throw new Error('not_found')
      }
      const json = (await response.json()) as Establishment
      cache.set(establishmentSlug, json)
      data.value = json
    } catch {
      data.value = null
      error.value = 'Заведение не найдено'
    } finally {
      loading.value = false
    }
  }

  if (typeof slug === 'string') {
    load(slug)
  } else {
    watch(
      slug,
      (value) => {
        load(value)
      },
      { immediate: true },
    )
  }

  return { data, loading, error, reload: () => load(typeof slug === 'string' ? slug : slug.value) }
}
