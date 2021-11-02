import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/customer',
    name: 'Customer',
    component: () => import(/* webpackChunkName: "about" */ '../views/customer.vue')
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import(/* webpackChunkName: "about" */ '../views/mine.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import(/* webpackChunkName: "about" */ '../views/user/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/register.vue')
  },
  {
    path: '/recruitment',
    name: 'Recruitment',
    component: () => import(/* webpackChunkName: "about" */ '../views/user/recruitment.vue')
  },
  {
    path: '/userInfo',
    name: 'userInfo',
    component: () => import(/* webpackChunkName: "about" */ '../views/userInfo/index.vue')
  },
]

const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes
});

export default router
