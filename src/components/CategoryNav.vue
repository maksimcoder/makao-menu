<script setup lang="ts">
import {
  Wine,
  GlassWater,
  Martini,
  Beer,
  BottleWine,
  Grape,
  Wind,
  CakeSlice,
  Coffee,
} from 'lucide-vue-next'
import type { CategoryIconId, MenuCategory } from '../types/establishment'
import { onBeforeUnmount, onMounted, ref, type Component } from 'vue'

const props = defineProps<{
  categories: MenuCategory[]
  activeCategoryId: string
}>()

const emit = defineEmits<{
  select: [categoryId: string]
}>()

const iconMap: Record<CategoryIconId, Component> = {
  cocktail: Martini,
  lemonade: GlassWater,
  wine: Wine,
  whiskey: BottleWine,
  spirits: Beer,
  cognac: Grape,
  hookah: Wind,
  dessert: CakeSlice,
  coffee: Coffee,
}

const isSticky = ref(false)
const navRef = ref<HTMLElement | null>(null)
/** top в px при sticky — компенсация visualViewport Safari iOS */
const stickyTopPx = ref<number | null>(null)

let safeAreaTopPx = 0

/** Порог scrollY, после которого nav «прилип»; не пересчитываем при resize viewport на iOS */
let stickThreshold = 0

const UNSTICK_LEAD = 24
/** Допуск (px): nav считается «у верха», когда rect.top не больше этой величины */
const STICK_TOP_TOLERANCE = 0.5

const getScrollY = () =>
  window.scrollY ||
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  0

const measureStickThreshold = () => {
  if (!navRef.value) return
  stickThreshold = navRef.value.getBoundingClientRect().top + getScrollY()
}

const getStickTop = () => stickyTopPx.value ?? safeAreaTopPx

/** Фон только когда верх nav реально у линии sticky (без раннего STICK_LEAD) */
const isAtStickLine = () => {
  if (!navRef.value) return false
  return navRef.value.getBoundingClientRect().top <= getStickTop() + STICK_TOP_TOLERANCE
}

const updateStickyState = () => {
  const y = getScrollY()

  if (!isSticky.value) {
    if (isAtStickLine()) {
      isSticky.value = true
      syncStickyTop()
    }
    return
  }

  if (y < stickThreshold - UNSTICK_LEAD) {
    isSticky.value = false
    stickyTopPx.value = null
    return
  }

  syncStickyTop()
}

const measureSafeAreaTop = () => {
  const probe = document.createElement('div')
  probe.style.cssText =
    'position:fixed;top:0;left:0;visibility:hidden;pointer-events:none;padding-top:var(--safe-top)'
  document.body.appendChild(probe)
  safeAreaTopPx = parseFloat(getComputedStyle(probe).paddingTop) || 0
  document.body.removeChild(probe)
}

const syncStickyTop = () => {
  if (!isSticky.value) {
    stickyTopPx.value = null
    return
  }

  const vvOffset = Math.round(window.visualViewport?.offsetTop ?? 0)
  // inline top только если Safari сдвинул visualViewport; иначе — CSS var(--safe-top)
  stickyTopPx.value = vvOffset > safeAreaTopPx ? vvOffset : null
}

const syncLayout = () => {
  const wasSticky = isSticky.value
  updateStickyState()

  if (!wasSticky && !isSticky.value) {
    measureStickThreshold()
    return
  }

  syncStickyTop()
}

const onViewportChange = () => {
  if (isSticky.value) {
    syncStickyTop()
    return
  }

  measureStickThreshold()
  updateStickyState()
}

onMounted(() => {
  measureSafeAreaTop()
  measureStickThreshold()
  updateStickyState()
  syncStickyTop()

  window.addEventListener('scroll', syncLayout, { passive: true })
  window.visualViewport?.addEventListener('resize', onViewportChange)
  window.visualViewport?.addEventListener('scroll', onViewportChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', syncLayout)
  window.visualViewport?.removeEventListener('resize', onViewportChange)
  window.visualViewport?.removeEventListener('scroll', onViewportChange)
})

/** Прокрутка так, чтобы nav прилип к верху (фон sticky сохраняется) */
const scrollToStickPosition = () => {
  measureStickThreshold()
  const targetY = Math.max(0, stickThreshold)
  window.scrollTo({ top: targetY, left: 0, behavior: 'auto' })

  requestAnimationFrame(() => {
    updateStickyState()
    syncLayout()
  })
}

defineExpose({ scrollToStickPosition })
</script>

<template>
  <nav
    ref="navRef"
    :class="{ 'category-nav--sticky': isSticky }"
    :style="stickyTopPx !== null ? { top: `${stickyTopPx}px` } : undefined"
    class="category-nav"
    aria-label="Категории меню"
  >
    <div class="category-nav__scroll">
      <button
        v-for="category in props.categories"
        :key="category.id"
        type="button"
        class="category-nav__item"
        :class="{ 'category-nav__item--active': category.id === activeCategoryId }"
        @click="emit('select', category.id)"
      >
        <span class="category-nav__icon-wrap">
          <component :is="iconMap[category.icon]" :size="24" />
        </span>
        <span class="category-nav__label">{{ category.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.category-nav {
  position: -webkit-sticky;
  position: sticky;
  top: var(--safe-top);
  z-index: 20;
  background-color: transparent;
  transition:
    background-color 0.2s ease,
    backdrop-filter 0.2s ease;
  padding: 0.5rem 0 0.75rem;
}

.category-nav--sticky {
  background-color: rgba(0, 0, 0, 0.85);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.category-nav__scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0 1rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-nav__scroll::-webkit-scrollbar {
  display: none;
}

.category-nav__item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  width: 72px;
  padding: 0;
}

.category-nav__icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition:
    background 0.2s,
    color 0.2s;
}

.category-nav__item--active .category-nav__icon-wrap {
  background: var(--color-accent);
  color: var(--color-text);
}

.category-nav__label {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  text-align: center;
  line-height: 1.2;
  max-width: 72px;
}

.category-nav__item--active .category-nav__label {
  color: var(--color-text);
}
</style>
