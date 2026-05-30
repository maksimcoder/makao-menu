import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/cdn': {
        target: 'https://images.ctfassets.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, ''),
      },
      '/cdn-eu': {
        target: 'https://images.eu.ctfassets.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn-eu/, ''),
      },
    },
  },
})
