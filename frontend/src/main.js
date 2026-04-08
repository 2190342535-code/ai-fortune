import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './src/router/index.js'
import App from './src/App.vue'
import './src/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')