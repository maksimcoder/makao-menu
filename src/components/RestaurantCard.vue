<script setup lang="ts">
import { Clock, Phone, Instagram, MapPin, ChevronRight } from 'lucide-vue-next'
import type { RestaurantSummary } from '../lib/contentful'

defineProps<{
  restaurant: RestaurantSummary
  to: string
}>()
</script>

<template>
  <router-link :to="to" class="rest-card">
    <h2 class="rest-card__title">{{ restaurant.title }}</h2>
    <div class="rest-card__body">
      <div class="rest-card__thumb">
        <img
          v-if="restaurant.thumbnail"
          :src="restaurant.thumbnail.url"
          :alt="restaurant.thumbnail.alt || restaurant.title"
          loading="lazy"
          decoding="async"
          :width="restaurant.thumbnail.width"
          :height="restaurant.thumbnail.height"
        />
        <span v-else class="rest-card__thumb-placeholder" aria-hidden="true" />
      </div>
      <ul class="rest-card__info">
        <li v-if="restaurant.schedule" class="rest-card__row">
          <Clock :size="14" class="rest-card__icon" />
          <span>{{ restaurant.schedule }}</span>
        </li>
        <li v-if="restaurant.address" class="rest-card__row">
          <MapPin :size="14" class="rest-card__icon" />
          <span>{{ restaurant.address }}</span>
        </li>
        <li v-if="restaurant.phone" class="rest-card__row">
          <Phone :size="14" class="rest-card__icon" />
          <span>{{ restaurant.phone }}</span>
        </li>
        <li v-if="restaurant.instagram" class="rest-card__row">
          <Instagram :size="14" class="rest-card__icon" />
          <span>{{ restaurant.instagram }}</span>
        </li>
      </ul>
    </div>
    <ChevronRight :size="18" class="rest-card__chevron" />
  </router-link>
</template>

<style scoped>
.rest-card {
  position: relative;
  display: block;
  padding: 1rem 1.25rem 1.1rem;
  border-radius: 1rem;
  background: var(--color-bg-elevated);
  border: 1px solid rgba(201, 162, 39, 0.12);
  color: var(--color-text);
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.rest-card:hover,
.rest-card:focus-visible {
  border-color: rgba(201, 162, 39, 0.4);
  transform: translateY(-1px);
  outline: none;
}

.rest-card__title {
  margin: 0 1.5rem 0.75rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--color-gold);
}

.rest-card__body {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
}

.rest-card__thumb {
  flex-shrink: 0;
  width: 96px;
  height: 96px;
  border-radius: 0.625rem;
  overflow: hidden;
  background: var(--color-bg-pill);
}

.rest-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rest-card__thumb-placeholder {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(201, 162, 39, 0.12),
    rgba(92, 42, 42, 0.18)
  );
}

.rest-card__info {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 0.4rem;
  font-size: 0.8rem;
  line-height: 1.35;
  color: var(--color-text-muted);
}

.rest-card__row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  word-break: break-word;
}

.rest-card__icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--color-gold-dim);
}

.rest-card__row span {
  color: var(--color-text);
  font-weight: 500;
}

.rest-card__chevron {
  position: absolute;
  top: 1.05rem;
  right: 1rem;
  color: var(--color-gold-dim);
}
</style>
