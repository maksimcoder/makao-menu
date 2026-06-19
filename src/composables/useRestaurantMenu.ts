import { onMounted, ref, watch, type Ref } from 'vue'
import type { Establishment } from '../types/establishment'
import {
  fetchRestaurantMenuBySlug,
  isContentfulConfigured,
} from '../lib/contentful'

export function useRestaurantMenu(slug: Ref<string> | string) {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const disabled = ref(!isContentfulConfigured())
  const data = ref<Establishment | null>(null)

  const load = async (establishmentSlug: string) => {
    if (!isContentfulConfigured()) {
      disabled.value = true
      error.value = null
      data.value = null
      return
    }

    if (!establishmentSlug.trim()) {
      disabled.value = false
      error.value = 'Заведение не указано'
      data.value = null
      return
    }

    disabled.value = false
    loading.value = true
    error.value = null

    try {
      const result = await fetchRestaurantMenuBySlug(establishmentSlug)
      if (!result) {
        data.value = null
        error.value = 'Меню не найдено'
        return
      }
      data.value = result
    } catch (e) {
      data.value = null
      error.value =
        e instanceof Error ? e.message : 'Ошибка запроса к Contentful'
    } finally {
      loading.value = false
    }
  }

  if (typeof slug === 'string') {
    onMounted(() => {
      void load(slug)
    })
  } else {
    watch(
      slug,
      (value) => {
        void load(value)
      },
      { immediate: true },
    )
  }

  return {
    loading,
    error,
    disabled,
    data,
    reload: () => load(typeof slug === 'string' ? slug : slug.value),
  }
}
