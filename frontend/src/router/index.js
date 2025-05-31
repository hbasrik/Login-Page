import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../views/SignIn.vue'
import UserPanel from '../views/UserPanel.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const routes = [
  { path: '/signin', component: SignIn },
  { path: '/', component: UserPanel, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (!requiresAuth) {
    return next()
  }


  const unsubscribe = onAuthStateChanged(auth, user => {
    unsubscribe() 
    if (user) {
      next()
    } else {
      next('/signin')
    }
  })
})

export default router
