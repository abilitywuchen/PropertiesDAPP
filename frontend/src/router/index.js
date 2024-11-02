import { createRouter, createWebHistory } from 'vue-router'
import MyPropertyVue from '@/components/MyProperty.vue'
import PropertyMarketVue from '@/components/PropertyMarket.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/myprop'
    },
    {
      path: '/market',
      component: PropertyMarketVue
    },
    {
      path: '/myprop',
      component: MyPropertyVue
    }
  ]
})

export default router
