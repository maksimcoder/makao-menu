<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'

const router = useRouter()
</script>

<template>
  <AppShell>
    <div class="not-found">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <button type="button" class="not-found__btn" @click="router.push('/main')">
        На главную
      </button>
    </div>
  </AppShell>
</template>

<style scoped>
.not-found {
  padding: 4rem 1.5rem;
  text-align: center;
}

.not-found h1 {
  margin: 0;
  font-size: 3rem;
  color: var(--color-gold);
}

.not-found p {
  color: var(--color-text-muted);
  margin: 1rem 0 2rem;
}

.not-found__btn {
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
}
</style>
