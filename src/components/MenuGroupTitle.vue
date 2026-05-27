<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="menu-group-title">
    {{ label }}
  </div>
</template>

<style scoped>
.menu-group-title {
  margin: 0 1rem 1rem;
  padding: 0.85rem 1.25rem;
  border-radius: 999px;
  background: var(--color-bg-pill);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
}
</style>
