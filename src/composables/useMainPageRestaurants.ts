import { onMounted, ref } from 'vue'
import {
  fetchMainPageRestaurants,
  isContentfulConfigured,
  type MainPageContent,
} from '../lib/contentful'

export function useMainPageRestaurants() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const disabled = ref(!isContentfulConfigured())
  const data = ref<MainPageContent | null>(null)

  const load = async () => {
    if (!isContentfulConfigured()) {
      disabled.value = true
      error.value = null
      data.value = null
      return
    }

    disabled.value = false
    loading.value = true
    error.value = null

    try {
      data.value = await fetchMainPageRestaurants()
    } catch (e) {
      data.value = null
      error.value =
        e instanceof Error ? e.message : 'Ошибка запроса к Contentful'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void load()
  })

  return { loading, error, disabled, data, reload: load }
}
