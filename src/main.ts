import './assets/main.css'

import { createApp } from 'vue'
import uiPlugin from '@nuxt/ui/vue-plugin'
import { createPinia } from 'pinia'
import '@vueuse/core'
import { createI18n } from 'vue-i18n'

import router from './router'
import App from './App.vue'
import setupAxios from './plugins/axios'

const app = createApp(App)

const i18n = createI18n({
  legacy: false,
  locale: 'vi',
  availableLocales: ['vi', 'en', 'zh'],
  messages: {
    vi: {
      // ...
    },
    en: {
      // ...
    },
    zh: {
      // ...
    },
  },
})

setupAxios()
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(uiPlugin)
app.mount('#app')
