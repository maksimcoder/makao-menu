<script setup lang="ts">
import { computed, nextTick, ref, toRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import BrandHeader from '../components/BrandHeader.vue'
import CategoryNav from '../components/CategoryNav.vue'
import ProductList from '../components/ProductList.vue'
import BottomNav from '../components/BottomNav.vue'
import { useRestaurantMenu } from '../composables/useRestaurantMenu'
import { getMenuCategory, getMenuSection } from '../utils/menu'

const props = defineProps<{
  establishment: string
}>()

const route = useRoute()
const router = useRouter()
const { data, loading, error, disabled } = useRestaurantMenu(
  toRef(props, 'establishment'),
)
const categoryNavRef = ref<InstanceType<typeof CategoryNav> | null>(null)

const sectionId = computed(() => route.query.section as string | undefined)
const categoryId = computed(() => route.query.category as string | undefined)

const activeSection = computed(() => {
  if (!data.value) return undefined
  return getMenuSection(data.value, sectionId.value)
})

const activeCategory = computed(() => {
  if (!activeSection.value) return undefined
  return getMenuCategory(activeSection.value, categoryId.value)
})

const syncQueryDefaults = () => {
  if (!data.value || loading.value) return

  const section = getMenuSection(data.value, sectionId.value)
  if (!section) return

  const category = getMenuCategory(section, categoryId.value)
  const needsSync =
    route.query.section !== section.id || route.query.category !== category?.id

  if (needsSync && category) {
    router.replace({
      name: 'menu',
      params: { establishment: props.establishment },
      query: { section: section.id, category: category.id },
    })
  }
}

watch([data, loading, () => route.query], syncQueryDefaults, { immediate: true })

const scrollCategoryNavIntoStick = () => {
  nextTick(() => {
    categoryNavRef.value?.scrollToStickPosition()
  })
}

const onCategorySelect = async (id: string) => {
  if (!activeSection.value || id === categoryId.value) return

  await router.replace({
    name: 'menu',
    params: { establishment: props.establishment },
    query: {
      section: activeSection.value.id,
      category: id,
    },
  })
}

watch(
  () => `${route.query.section ?? ''}:${route.query.category ?? ''}`,
  (queryKey, prevKey) => {
    if (!prevKey || queryKey === prevKey || route.name !== 'menu') return
    scrollCategoryNavIntoStick()
  },
)
</script>

<template>
  <AppShell with-bottom-nav>
    <div v-if="disabled" class="state">
      Contentful не настроен — добавьте ключи в <code>.env.local</code>.
    </div>
    <div v-else-if="loading" class="state">Загрузка…</div>
    <div v-else-if="error || !data" class="state">{{ error ?? 'Меню не найдено' }}</div>
    <template v-else>
      <BrandHeader
        :name="data.brand.name"
        :subtitle="data.brand.subtitle"
        compact
      />
      <template v-if="activeSection && activeCategory">
        <CategoryNav
          ref="categoryNavRef"
          :categories="activeSection.categories"
          :active-category-id="activeCategory.id"
          @select="onCategorySelect"
        />
        <ProductList :groups="activeCategory.groups" />
      </template>
      <div v-else class="state">Раздел меню не найден</div>
      <BottomNav
        :establishment="data"
        :active-section-id="activeSection?.id"
      />
    </template>
  </AppShell>
</template>

<style scoped>
.state {
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--color-text-muted);
}

.state code {
  font-size: 0.8rem;
  background: var(--color-bg-elevated);
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
}
</style>
