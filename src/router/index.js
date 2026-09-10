import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import HomeView from '../views/HomeView.vue'
import CarsView from '../views/CarsView.vue'
import CarDetails from '../views/CarDetails.vue'
import SignIn from '../views/SignIn.vue'
import VerifyOtp from '../views/VerifyOtp.vue'
import CompleteProfile from '../views/CompleteProfile.vue'
import Dashboard from '../views/seller/Dashboard.vue'
import Ads from '../views/seller/Ads.vue'
import Plans from '../views/seller/Plans.vue'
import AccountVerification from '../views/seller/AccountVerification.vue'
import CreateAd from '../views/seller/CreateAd.vue'
import EditAd from '../views/seller/EditAd.vue'
import EditProfile from '../views/seller/EditProfile.vue'
import SellerProfile from '../views/SellerProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {layout: 'default'}
    },
    {
      path: '/cars',
      name: 'cars',
      component: CarsView,
      meta: {layout: 'default'}
    },
    {
      path: '/cars/:id',
      name: 'carDetails',
      component: CarDetails,
      meta: {layout: 'default'}
    },
    {
      path: '/seller/:id',
      name: 'sellerProfile',
      component: SellerProfile,
      meta: {layout: 'default'}
    },
    {
      path: '/seller/cars/:id',
      name: 'sellerCarDetails',
      component: CarDetails,
      meta: {layout: 'seller'}
    },
    {
      path: '/signin',
      name: 'signIn',
      component: SignIn,
      meta: {layout: 'auth'}
    },
    {
      path: '/verifyOtp',
      name: 'verifyOtp',
      component: VerifyOtp,
      meta: {layout: 'auth'}
    },
    {
      path: '/complete-profile',
      name: 'completeProfile',
      component: CompleteProfile,
      meta: {layout: 'auth'}
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/my-ads',
      name: 'ads',
      component: Ads,
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/plans',
      name: 'plans',
      component: Plans,
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/account-verification',
      name: 'accountVerification',
      component: AccountVerification,
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/create-ad',
      name: 'create-ad',
      component: CreateAd,
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/edit-ad/:id',
      name: 'edit-ad',
      component: EditAd,
      meta: {layout: 'seller', requiresAuth: true}
    },
    {
      path: '/profile',
      name: 'profile',
      component: EditProfile,
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
