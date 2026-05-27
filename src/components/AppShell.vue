<script setup lang="ts">
defineProps<{
  withBottomNav?: boolean
}>()
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--nav': withBottomNav }">
    <slot />
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
  max-width: var(--shell-max-width);
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
}

.app-shell--nav {
  padding-bottom: var(--bottom-nav-height);
}
</style>
