import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import Basket from '../views/Basket.vue'
import Account from '../views/Account.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/shop', component: Shop },
  { path: '/basket', component: Basket },
  { path: '/account', component: Account }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router