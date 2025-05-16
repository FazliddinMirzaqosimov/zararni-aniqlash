import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      redirect: 'home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/MapSession.vue'),
        },
        {
          path: '/calculate',
          name: 'calculate',
          component: () => import('@/views/CalculateSubstances.vue'),
        },
        {
          path: '/pollution',
          name: 'pollution',
          component: () => import('@/views/Pollution.vue'),
        },
        {
          path: '/yearly',
          name: 'yearly-pollution',
          component: () => import('@/views/YearlyPollution.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

export default router
