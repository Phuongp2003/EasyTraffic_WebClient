import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import ui from '@nuxt/ui/vite'
import tailwindcss from '@tailwindcss/vite'

// Import all themes
// import * as themes from './src/theme'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    ui({
      ui: {
        // ...themes,
        tabs: {
          slots: {
            root: 'relative flex items-center gap-2',
            list: 'sticky top-0 z-19 flex p-1 group',
          },
        },
        color: {
          default: 'neutral',
          error: '#fff',
        },
      },
      autoImport: {
        imports: ['vue'],
      },
      components: {
        dirs: ['./src/components'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
