import { createWebHistory, createRouter } from 'vue-router'
import { getCurrentUser } from 'vuefire'
import HomeView from './views/Home.vue'
import RoomView from './views/Room.vue'
import LoginView from './views/Login.vue'
import ScenarioEditorView from './views/admin/ScenarioEditor.vue'
import AdminRoomView from './views/admin/Room.vue'
import RoomsView from './views/admin/Rooms.vue'
import UnauthorizedView from './views/Unauthorized.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/scenarios', component: ScenarioEditorView, meta: { auth: 'admin' } },
  { path: '/room/:roomId', component: RoomView, meta: { auth: 'user' } },
  { path: '/room/:roomId/admin', component: AdminRoomView, meta: { auth: 'admin' } },
  { path: '/rooms', component: RoomsView, meta: { auth: 'admin' } },
  { path: '/unauthorized', component: UnauthorizedView },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(async to => {
  // routes with `meta: { requiresAuth: true }` will check for
  // the users, others won't
  if (to.meta.auth) {
    const currentUser = await getCurrentUser()
    // if the user is not logged in, redirect to the login page
    if (!currentUser) {
      return {
        path: '/login',
        query: {
          // we keep the current path in the query so we can
          // redirect to it after login with
          // `router.push(route.query.redirect || '/')`
          redirect: to.fullPath,
        },
      }
    }
    const role = await currentUser.getIdTokenResult().then(idTokenResult => {
      return idTokenResult.claims.role || 'user'
    })
    if (to.meta.auth === 'admin' && role !== 'admin') {
      return { path: '/unauthorized' }
    }
  }
})

export default router
