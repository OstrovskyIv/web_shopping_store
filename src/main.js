import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Если используете Vuex

// Импорт стилей
import '@/assets/css/style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)

app.use(router)
app.use(store) // Если используете Vuex

app.mount('#app')