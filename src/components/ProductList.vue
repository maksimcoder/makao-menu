<script setup lang="ts">
import type { MenuGroup } from '../types/establishment'
import MenuGroupTitle from './MenuGroupTitle.vue'
import ProductCard from './ProductCard.vue'

defineProps<{
  groups: MenuGroup[]
}>()
</script>

<template>
  <div class="product-list">
    <section v-for="group in groups" :key="group.id" class="product-list__group">
      <MenuGroupTitle :label="group.label" />
      <ProductCard v-for="item in group.items" :key="item.id" :item="item" />
    </section>
  </div>
</template>

<style scoped>
.product-list {
  margin-top: 1rem;
  padding-bottom: 1rem;
}

.product-list__group + .product-list__group {
  margin-top: 0.5rem;
}
</style>
