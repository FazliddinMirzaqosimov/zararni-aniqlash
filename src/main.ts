import Aura from '@primeuix/themes/aura'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import './assets/styles.scss'
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';


const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
})
app.use(router)
app.use(ToastService);
app.use(ConfirmationService);
app.mount('#app')
