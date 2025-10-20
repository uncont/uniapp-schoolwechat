import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './utils/request.js' // 导入请求拦截器

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  return {
    app
  }
}
