<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  name: string
  subtitle: string
  compact?: boolean
}>()
</script>

<template>
  <header class="brand-header" :class="{ 'brand-header--compact': compact }">
    <h1 class="brand-header__logo-wrap">
      <RouterLink
        :to="{ name: 'home' }"
        class="brand-header__logo-link"
        aria-label="На главную — список заведений"
      >
        <img src="/images/logo.png" :alt="name" class="brand-header__logo" />
      </RouterLink>
    </h1>
    <div v-if="subtitle" class="brand-header__subtitle-row">
      <span class="brand-header__line" />
      <span class="brand-header__subtitle">{{ subtitle }}</span>
      <span class="brand-header__line" />
    </div>
  </header>
</template>

<style scoped>
.brand-header {
  text-align: center;
  padding: 2rem 1.25rem 1rem;
}

.brand-header--compact {
  padding: 1.25rem 1rem 0.75rem;
}

.brand-header__logo-wrap {
  margin: 0;
  line-height: 0;
}

.brand-header__logo-link {
  display: inline-block;
  line-height: 0;
  text-decoration: none;
  border-radius: 0.25rem;
}

.brand-header__logo-link:focus-visible {
  outline: 2px solid var(--color-gold-dim);
  outline-offset: 4px;
}

.brand-header__logo {
  display: block;
  margin: 0 auto;
  width: min(220px, 72vw);
  /* height: auto; */
  height: 50px;
  object-fit: cover;
}

.brand-header--compact .brand-header__logo {
  width: min(180px, 65vw);
}

.brand-header__subtitle-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  justify-content: center;
}

.brand-header__line {
  flex: 1;
  max-width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold-dim), transparent);
}

.brand-header__subtitle {
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: var(--color-gold-dim);
  white-space: nowrap;
}
</style>
