import { createApp } from 'vue'
import App from './App.vue'


import './assets/css/app.css'
import './assets/css/styles.css'

import router from './router'

const app = createApp(App)
app.use(router) // Instala el enrutador en la aplicación
app.mount('#app')
