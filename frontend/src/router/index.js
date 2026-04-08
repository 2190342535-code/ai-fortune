import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/create-role',
    name: 'CreateRole',
    component: () => import('./views/CreateRole.vue')
  },
  {
    path: '/mbti-test',
    name: 'MbtiTest',
    component: () => import('./views/MbtiTest.vue')
  },
  {
    path: '/mbti-result',
    name: 'MbtiResult',
    component: () => import('./views/MbtiResult.vue')
  },
  {
    path: '/astro',
    name: 'AstroAnalysis',
    component: () => import('./views/AstroAnalysis.vue')
  },
  {
    path: '/daily',
    name: 'DailyLuck',
    component: () => import('./views/DailyLuck.vue')
  },
  {
    path: '/fortune',
    name: 'Fortune',
    component: () => import('./views/Fortune.vue')
  },
  {
    path: '/dream',
    name: 'Dream',
    component: () => import('./views/Dream.vue')
  },
  {
    path: '/hexagram',
    name: 'Hexagram',
    component: () => import('./views/Hexagram.vue')
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('./views/Chat.vue')
  },
  {
    path: '/life-number',
    name: 'LifeNumber',
    component: () => import('./views/LifeNumber.vue')
  },
  {
    path: '/name-analysis',
    name: 'NameAnalysis',
    component: () => import('./views/NameAnalysis.vue')
  },
  {
    path: '/compatibility',
    name: 'Compatibility',
    component: () => import('./views/Compatibility.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router