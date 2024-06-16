import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './views/Home.vue'
import LoginView from './views/Login.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
createApp(App).use(router).mount('#app')
