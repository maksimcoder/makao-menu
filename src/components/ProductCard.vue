<script setup lang="ts">
import type { MenuItem } from '../types/establishment'

defineProps<{
  item: MenuItem
}>()
</script>

<template>
  <article class="product-card">
    <div class="product-card__info">
      <span v-if="item.isNew" class="product-card__badge">new</span>
      <h3 class="product-card__name">{{ item.name }}</h3>
      <p v-if="item.description" class="product-card__description">
        {{ item.description }}
      </p>
      <p class="product-card__price-label">Цена</p>
      <p class="product-card__price">
        {{ item.price }} {{ item.currency }}
      </p>
    </div>
    <div class="product-card__image-wrap">
      <img
        :src="item.image"
        :alt="item.name"
        class="product-card__image"
        loading="lazy"
      />
    </div>
  </article>
</template>

<style scoped>
.product-card {
  margin: 0 1rem 1.5rem;
  border-radius: 16px;
  overflow: hidden;
  background: var(--color-bg-elevated);
  position: relative;
}

.product-card__info {
  padding: 1.25rem 1.25rem 0.75rem;
  position: relative;
}

.product-card__badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-new);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  letter-spacing: 0.05em;
}

.product-card__name {
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
  font-weight: 700;
  padding-right: 3rem;
}

.product-card__description {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--color-text-muted);
  font-weight: 400;
}

.product-card__price-label {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.product-card__price {
  margin: 0.15rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.product-card__image-wrap {
  aspect-ratio: 3 / 3;
  overflow: hidden;
  background: #0a0605;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
