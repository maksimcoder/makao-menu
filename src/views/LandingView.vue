<script setup lang="ts">
import { toRef } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, Phone, Instagram, MapPin } from 'lucide-vue-next'
import AppShell from '../components/AppShell.vue'
import BrandHeader from '../components/BrandHeader.vue'
import MenuButton from '../components/MenuButton.vue'
import InfoRow from '../components/InfoRow.vue'
import AmenityIcons from '../components/AmenityIcons.vue'
import { useEstablishment } from '../composables/useEstablishment'
import { getDefaultMenuQuery } from '../utils/menu'

const props = defineProps<{
  establishment: string
}>()

const router = useRouter()
const { data, loading, error } = useEstablishment(toRef(props, 'establishment'))

const goToMenu = () => {
  if (!data.value) return
  const query = getDefaultMenuQuery(data.value)
  router.push({
    name: 'menu',
    params: { establishment: props.establishment },
    query,
  })
}
</script>

<template>
  <AppShell>
    <div v-if="loading" class="state">Загрузка…</div>
    <div v-else-if="error || !data" class="state">{{ error ?? 'Заведение не найдено' }}</div>
    <template v-else>
      <BrandHeader :name="data.brand.name" :subtitle="data.brand.subtitle" />
      <MenuButton @click="goToMenu" />
      <section class="landing-info">
        <InfoRow label="Режим работы" :icon="Clock">
          <p v-for="(line, i) in data.landing.schedule" :key="i">{{ line }}</p>
        </InfoRow>
        <InfoRow
          label="Телефон для брони"
          :icon="Phone"
          :href="`tel:${data.landing.phone.tel}`"
        >
          <p>{{ data.landing.phone.display }}</p>
        </InfoRow>
        <InfoRow
          label="Instagram"
          :icon="Instagram"
          :href="data.landing.instagram.url"
        >
          <p>{{ data.landing.instagram.handle }}</p>
        </InfoRow>
        <InfoRow
          label="Адрес"
          :icon="MapPin"
          :href="data.landing.address.mapUrl"
        >
          <p>{{ data.landing.address.text }}</p>
        </InfoRow>
      </section>
      <AmenityIcons :amenities="data.landing.amenities" />
    </template>
  </AppShell>
</template>

<style scoped>
.state {
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--color-text-muted);
}

.landing-info {
  padding-bottom: 0.5rem;
}
</style>
