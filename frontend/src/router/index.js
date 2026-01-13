import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('../views/modules/Tasks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/finance',
    name: 'finance',
    component: () => import('../views/modules/Finance.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/productivity',
    name: 'productivity',
    component: () => import('../views/modules/Productivity.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/habits',
    name: 'habits',
    component: () => import('../views/modules/Habits.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/storage',
    name: 'storage',
    component: () => import('../views/modules/Storage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/journals',
    name: 'journals',
    component: () => import('../views/modules/Journals.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Redirect authenticated users away from home/login/register to dashboard
  if ((to.name === 'home' || to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } 
  // Redirect unauthenticated users away from protected routes to login
  else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } 
  else {
    next()
  }
})

export default router

