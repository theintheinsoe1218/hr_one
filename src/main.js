import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)

// Initialize auth state BEFORE router resolves
import { useAuthStore } from './store/auth'
useAuthStore(pinia).initialize()

// Wait for the initial navigation (and all guards) to complete
// before mounting — this prevents ANY flash of authenticated content
router.isReady().then(() => {
    app.mount('#app')
})
