import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style/index.css'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

import { auth } from '@/firebase/firebase'
window.auth = auth

app.use(createPinia())
app.use(router)

app.mount('#app')
