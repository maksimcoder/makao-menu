<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
import type { Component } from 'vue'

defineProps<{
  label: string
  icon: Component
  href?: string
}>()
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    class="info-row"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
  >
    <div class="info-row__icon-wrap">
      <component :is="icon" :size="22" class="info-row__icon" />
    </div>
    <div class="info-row__content">
      <span class="info-row__label">{{ label }}</span>
      <div class="info-row__values">
        <slot />
      </div>
    </div>
    <div v-if="href" class="info-row__action">
      <ExternalLink :size="18" />
    </div>
  </component>
</template>

<style scoped>
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: inherit;
}

.info-row__icon-wrap {
  flex-shrink: 0;
  width: 28px;
  display: flex;
  justify-content: center;
  padding-top: 2px;
  color: var(--color-text-muted);
}

.info-row__content {
  flex: 1;
  min-width: 0;
}

.info-row__label {
  display: block;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-gold-dim);
  margin-bottom: 0.35rem;
}

.info-row__values {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
}

.info-row__values :deep(p) {
  margin: 0;
}

.info-row__values :deep(p + p) {
  margin-top: 0.15rem;
}

.info-row__action {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}
</style>
