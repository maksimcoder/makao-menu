<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'
import { useIsDesktop } from '../composables/useIsDesktop'

const { isDesktop } = useIsDesktop()
const route = useRoute()
const qrDataUrl = ref('')

const buildQr = async () => {
  const url = `${window.location.origin}${route.fullPath}`
  try {
    qrDataUrl.value = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: { dark: '#1a1210', light: '#f5f0eb' },
    })
  } catch {
    qrDataUrl.value = ''
  }
}

onMounted(buildQr)
watch(() => route.fullPath, buildQr)
</script>

<template>
  <div v-if="isDesktop" class="desktop-gate">
    <div class="desktop-gate__card">
      <h1 class="desktop-gate__title">Переверните телефон</h1>
      <p class="desktop-gate__text">
        Сайт доступен только на мобильных устройствах.
      </p>
      <p class="desktop-gate__hint">
        Отсканируйте QR-код с телефона, чтобы открыть сайт:
      </p>
      <img
        v-if="qrDataUrl"
        :src="qrDataUrl"
        alt="QR-код для открытия на телефоне"
        class="desktop-gate__qr"
      />
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.desktop-gate {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(ellipse at 50% 30%, #2a1810 0%, var(--color-bg) 60%);
}

.desktop-gate__card {
  max-width: 420px;
  text-align: center;
}

.desktop-gate__title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.desktop-gate__text,
.desktop-gate__hint {
  margin: 0 0 1rem;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.desktop-gate__qr {
  margin: 1.5rem auto 0;
  border-radius: 12px;
  background: #fff;
  padding: 8px;
}
</style>
