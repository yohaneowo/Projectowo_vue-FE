import "./assets/main.css"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import "./common/css/font-test.css"
import { createApp } from "vue"
import { createPinia } from "pinia"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import PrimeVue from 'primevue/config';

import App from "./App.vue"
import router from "./router"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount("#app")
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
