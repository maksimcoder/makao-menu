<script setup lang="ts">
defineProps<{
  label?: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button type="button" class="menu-button" @click="$emit('click')">
    {{ label ?? 'МЕНЮ' }}
  </button>
</template>

<style scoped>
.menu-button {
  display: block;
  width: calc(100% - 2.5rem);
  max-width: 320px;
  margin: 1.5rem auto 2rem;
  padding: 1rem 2rem;
  border-radius: 999px;
  border: 1px solid var(--color-gold);
  background: transparent;
  color: var(--color-gold);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  box-shadow:
    0 0 20px rgba(201, 162, 39, 0.2),
    inset 0 0 20px rgba(201, 162, 39, 0.05);
  transition:
    background 0.2s,
    color 0.2s;
}

.menu-button:active {
  background: rgba(201, 162, 39, 0.15);
}
</style>
