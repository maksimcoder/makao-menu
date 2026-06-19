import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

if (import.meta.env.DEV) {
  void import('./lib/contentful').then((contentful) => {
    const cf = contentful as typeof contentful & {
      MENU_DEBUG_QUERIES: typeof contentful.MENU_DEBUG_QUERIES
    }
    ;(globalThis as typeof globalThis & { __contentful: typeof cf }).__contentful = cf
    console.info(
      '[Contentful debug] Примеры запросов:\n',
      Object.entries(cf.MENU_DEBUG_QUERIES)
        .map(([name, cmd]) => `  ${name}: ${cmd}`)
        .join('\n'),
    )
  })
}
