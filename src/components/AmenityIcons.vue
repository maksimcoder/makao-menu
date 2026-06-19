<script setup lang="ts">
import { Wifi, Wind, Wine, UtensilsCrossed, Mouse, Gamepad2 } from 'lucide-vue-next'
import type { AmenityId } from '../types/establishment'
import type { Component } from 'vue'

const props = defineProps<{
  amenities: AmenityId[]
}>()

const iconMap: Record<AmenityId, Component> = {
  wifi: Wifi,
  hookah: Wind,
  cocktail: Wine,
  food: UtensilsCrossed,
  pc: Mouse,
  gamepad: Gamepad2,
}

const labels: Record<AmenityId, string> = {
  wifi: 'Wi-Fi',
  hookah: 'Кальяны',
  cocktail: 'Бар',
  food: 'Кухня',
  pc: 'ПК-зона',
  gamepad: 'Игры',
}
</script>

<template>
  <div class="amenity-icons">
    <div
      v-for="id in props.amenities"
      :key="id"
      class="amenity-icons__item"
      :title="labels[id]"
    >
      <component :is="iconMap[id]" :size="22" />
    </div>
  </div>
</template>

<style scoped>
.amenity-icons {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  padding: 2rem 1rem 2.5rem;
  flex-wrap: wrap;
}

.amenity-icons__item {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(245, 240, 235, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
}
</style>
