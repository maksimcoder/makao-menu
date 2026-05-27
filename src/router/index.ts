import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import MenuView from '../views/MenuView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/main',
    },
    {
      path: '/:establishment',
      name: 'landing',
      component: LandingView,
      props: true,
    },
    {
      path: '/:establishment/menu',
      name: 'menu',
      component: MenuView,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
  scrollBehavior(to, from) {
    if (
      to.name === from.name &&
      to.params.establishment === from.params.establishment &&
      to.path === from.path
    ) {
      return false
    }
    return { top: 0, left: 0 }
  },
})

export default router
