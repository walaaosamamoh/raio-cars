<template>
  <component :is="layout">
    <router-view :key="$route.fullPath"/>
  </component>
</template>

<script>
import DefaultLayout from './DefaultLayout.vue'
import AuthLayout from './AuthLayout.vue'
import SellerLayout from './SellerLayout.vue'
  export default {
    name: 'AppLayout',
    computed:{
      layout(){
        const layout = this.$route.meta.layout || 'DefaultLayout';
        if(layout === 'default') return DefaultLayout;
        if(layout === 'auth') return AuthLayout;
        if(layout === 'seller') return SellerLayout;
        return DefaultLayout;
      }
    }
  }
</script>