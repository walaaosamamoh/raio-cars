<template>
  <div class="seller-layout">
    <!-- sidebar -->
    <Sidebar v-model:isMobileOpen="isMobileSidebarOpen" @close-sidebar="isMobileSidebarOpen=false"/>

    <!-- main content -->
    <div class="flex flex-grow flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderSeller @toggle-sidebar="isMobileSidebarOpen = !isMobileSidebarOpen"/>
      <main
        class="flex-grow p-4 md:p-6 lg:p-8 overflow-auto"
        :style="{ overflow: isMobileSidebarOpen ? 'hidden' : 'auto' }"
      >
        <router-view :key="$route.fullPath" />
      </main>
    </div>
  </div>
</template>

<script>
import HeaderSeller from '@/components/layout/HeaderSeller.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
  export default {
    name: 'SellerLayout',
    components: {
      HeaderSeller,
      Sidebar
    },
    data(){
      return{
        isMobileSidebarOpen: false
      }
    },
    watch: {
      // Close mobile sidebar when route changes
      '$route'() {
        this.isMobileSidebarOpen = false
      },
    },
  }
</script>
<style>
.seller-layout{
  min-height: 100vh;
  display: flex;
}
</style>
