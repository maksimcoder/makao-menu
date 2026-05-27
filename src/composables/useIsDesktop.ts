import { onMounted, onUnmounted, ref } from 'vue'

const DESKTOP_QUERY = '(min-width: 768px)'

export function useIsDesktop() {
  const isDesktop = ref(false)

  let mediaQuery: MediaQueryList | null = null

  const update = () => {
    isDesktop.value = mediaQuery?.matches ?? window.innerWidth >= 768
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(DESKTOP_QUERY)
    update()
    mediaQuery.addEventListener('change', update)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', update)
  })

  return { isDesktop }
}
