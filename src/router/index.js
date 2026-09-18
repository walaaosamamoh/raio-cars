import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/default/HomeView.vue'),
      meta: {layout: 'default'}
    },
    {
      path: '/cars',
      name: 'cars',
      component: () => import('../views/default/CarsView.vue'),
      meta: {layout: 'default'}
    },
    {
      path: '/cars/:id',
      name: 'carDetails',
      component: () => import('../views/default/CarDetails.vue'),
      meta: {layout: 'default'}
    },
    {
      path: '/seller/:id',
      name: 'sellerProfile',
      component: () => import('../views/default/SellerProfile.vue'),
      meta: {layout: 'default'}
    },
    {
      path: '/signin',
      name: 'signIn',
      component: () => import('../views/auth/SignIn.vue'),
      meta: {layout: 'auth'}
    },
    {
      path: '/verifyOtp/:phone?',
      name: 'verifyOtp',
      component: () => import('../views/auth/VerifyOtp.vue'),
      meta: {layout: 'auth'}
    },
    {
      path: '/complete-profile',
      name: 'completeProfile',
      component: () => import('../views/auth/CompleteProfile.vue'),
      meta: {layout: 'auth'}
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/seller/Dashboard.vue'),
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/my-ads',
      name: 'ads',
      component: () => import('../views/seller/Ads.vue'),
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/plans',
      name: 'plans',
      component: () => import('../views/seller/Plans.vue'),
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/account-verification',
      name: 'accountVerification',
      component: () => import('../views/seller/AccountVerification.vue'),
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/create-ad',
      name: 'create-ad',
      component: () => import('../views/seller/CreateAd.vue'),
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/edit-ad/:id',
      name: 'edit-ad',
      component: () => import('../views/seller/EditAd.vue'),
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/seller/EditProfile.vue'),
      meta: {layout: 'seller', requiresAuth: true}
    }
  ],

  scrollBehavior(){
    return {top:0}
  }
})

router.beforeEach((to, from, next) => {
  const token = Cookies.get('auth-token')
  if(to.meta.requiresAuth && !token) {
    return next('/signin')
  }
  next()
})

export default router
