import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import {
  PrimeVueResolver,
  ElementPlusResolver,
} from 'unplugin-vue-components/resolvers'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    ,
  
  Components({
      resolvers: [
        PrimeVueResolver(),
        ElementPlusResolver(),
      ],
      dts: true,
    })
  
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
