<script setup lang="ts">
import AppShell from '../components/AppShell.vue'
import BrandHeader from '../components/BrandHeader.vue'
import RestaurantCard from '../components/RestaurantCard.vue'
import { useMainPageRestaurants } from '../composables/useMainPageRestaurants'

const { loading, error, disabled, data } = useMainPageRestaurants()
</script>

<template>
  <AppShell>
    <BrandHeader name="Makao" subtitle="Выберите заведение" />

    <main class="home">
      <h1 v-if="data?.pageTitle" class="home__title">{{ data.pageTitle }}</h1>

      <p v-if="disabled" class="home__state">
        Contentful не настроен — добавьте ключи в <code>.env.local</code>.
      </p>
      <p v-else-if="loading" class="home__state">Загрузка заведений…</p>
      <p v-else-if="error" class="home__state home__state--error">{{ error }}</p>
      <p
        v-else-if="data && data.restaurants.length === 0"
        class="home__state"
      >
        Нет опубликованных заведений.
      </p>

      <ul v-if="data?.restaurants.length" class="home__list">
        <li v-for="r in data.restaurants" :key="r.id">
          <RestaurantCard :restaurant="r" :to="`/${r.slug}`" />
        </li>
      </ul>
    </main>
  </AppShell>
</template>

<style scoped>
.home {
  padding: 0.5rem 1rem 2rem;
}

.home__title {
  margin: 1rem 0.25rem 1.25rem;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
  letter-spacing: 0.02em;
}

.home__state {
  margin: 1.5rem 0;
  padding: 0 0.5rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.home__state--error {
  color: #e57373;
}

.home__state code {
  font-size: 0.8rem;
  background: var(--color-bg-elevated);
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
}

.home__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}
</style>
