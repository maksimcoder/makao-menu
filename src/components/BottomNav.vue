<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, Martini, Wind, CakeSlice, ExternalLink } from 'lucide-vue-next'
import type { BottomNavItem, Establishment } from '../types/establishment'
import { getMenuSection } from '../utils/menu'
import type { Component } from 'vue'

const props = defineProps<{
  establishment: Establishment
  activeSectionId?: string
}>()

const route = useRoute()
const router = useRouter()

const slug = computed(() => props.establishment.slug)
const isMenuRoute = computed(() => route.name === 'menu')

const navIcons: Record<string, Component> = {
  home: Home,
  bar: Martini,
  hookah: Wind,
  desserts: CakeSlice,
}

const isActive = (item: BottomNavItem) => {
  if (item.type === 'home') {
    return route.name === 'landing'
  }
  if (item.type === 'menu') {
    return isMenuRoute.value && route.query.section === item.section
  }
  return false
}

const onNavClick = (item: BottomNavItem) => {
  if (item.type === 'home') {
    router.push({ name: 'landing', params: { establishment: slug.value } })
    return
  }

  if (item.type === 'menu' && item.section) {
    const section = getMenuSection(props.establishment, item.section)
    const firstCategory = section?.categories[0]
    router.push({
      name: 'menu',
      params: { establishment: slug.value },
      query: {
        section: item.section,
        category: firstCategory?.id,
      },
    })
    return
  }

  if (item.type === 'delivery' && item.url) {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }
}

const mergedNav = computed(() => {
  const items = [...props.establishment.bottomNav]
  const deliveries = props.establishment.deliveryLinks ?? []

  deliveries.forEach((delivery, index) => {
    const existing = items.find((i) => i.id === delivery.id)
    if (!existing) {
      items.push({
        id: delivery.id,
        label: delivery.label || `Доставка #${index + 1}`,
        type: 'delivery',
        url: delivery.url,
        logo: delivery.logo,
      })
    }
  })

  return items
})
</script>

<template>
  <nav class="bottom-nav" aria-label="Основная навигация">
    <button
      v-for="item in mergedNav"
      :key="item.id"
      type="button"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': isActive(item) }"
      @click="onNavClick(item)"
    >
      <span class="bottom-nav__icon-wrap">
        <img
          v-if="item.logo"
          :src="item.logo"
          :alt="item.label"
          class="bottom-nav__logo"
        />
        <component
          v-else-if="navIcons[item.id] || item.type === 'delivery'"
          :is="item.type === 'delivery' ? ExternalLink : navIcons[item.id]"
          :size="22"
        />
        <Martini v-else :size="22" />
      </span>
      <span class="bottom-nav__label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--shell-max-width);
  height: var(--bottom-nav-height);
  display: flex;
  background: var(--color-bg-elevated);
  border-top: 1px solid rgba(201, 162, 39, 0.15);
  z-index: 30;
}

.bottom-nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.35rem 0.15rem;
  min-width: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-text-muted);
  transition: background 0.2s;
}

.bottom-nav__item:last-child {
  border-right: none;
}

.bottom-nav__item--active {
  background: var(--color-accent);
  color: var(--color-text);
}

.bottom-nav__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
}

.bottom-nav__logo {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.bottom-nav__label {
  font-size: 0.55rem;
  line-height: 1.1;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 2px;
}
</style>
