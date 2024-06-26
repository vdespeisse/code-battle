import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createWebHistory, createRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlay, faCode, faTerminal } from '@fortawesome/free-solid-svg-icons'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import HomeView from './views/Home.vue'
import LoginView from './views/Login.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
]

library.add({ faPlay, faLightbulb, faCode, faTerminal })

const router = createRouter({
  history: createWebHistory(),
  routes,
})
createApp(App).component('fa-icon', FontAwesomeIcon).use(router).mount('#app')
