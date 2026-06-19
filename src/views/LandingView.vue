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
import { useRestaurantPage } from '../composables/useRestaurantPage'

const props = defineProps<{
  establishment: string
}>()

const router = useRouter()
const { data, loading, error, disabled } = useRestaurantPage(toRef(props, 'establishment'))
const { data: establishment } = useEstablishment(toRef(props, 'establishment'))

const goToMenu = () => {
  router.push({
    name: 'menu',
    params: { establishment: props.establishment },
  })
}
</script>

<template>
  <AppShell>
    <div v-if="disabled" class="state">
      Contentful не настроен — добавьте ключи в <code>.env.local</code>.
    </div>
    <div v-else-if="loading" class="state">Загрузка…</div>
    <div v-else-if="error || !data" class="state">{{ error ?? 'Заведение не найдено' }}</div>
    <template v-else>
      <BrandHeader :name="data.title" subtitle="" />
      <MenuButton @click="goToMenu" />
      <section class="landing-info">
        <InfoRow label="Режим работы" :icon="Clock">
          <p v-for="(line, i) in data.schedule" :key="i">{{ line }}</p>
        </InfoRow>
        <InfoRow
          label="Телефон для брони"
          :icon="Phone"
          :href="data.phone.tel ? `tel:${data.phone.tel}` : undefined"
        >
          <p>{{ data.phone.display }}</p>
        </InfoRow>
        <InfoRow
          label="Instagram"
          :icon="Instagram"
          :href="data.instagram.url || undefined"
        >
          <p>{{ data.instagram.handle }}</p>
        </InfoRow>
        <InfoRow
          label="Адрес"
          :icon="MapPin"
          :href="data.address.mapUrl || undefined"
        >
          <p>{{ data.address.text }}</p>
        </InfoRow>
      </section>
      <AmenityIcons
        v-if="establishment?.landing.amenities.length"
        :amenities="establishment.landing.amenities"
      />
    </template>
  </AppShell>
</template>

<style scoped>
.state {
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--color-text-muted);
}

.state code {
  font-size: 0.8rem;
  background: var(--color-bg-elevated);
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
}

.landing-info {
  padding-bottom: 0.5rem;
}
</style>
