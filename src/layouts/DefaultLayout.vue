<template>
  <div class="default-layout">
    <TheHeader />
    <main class="flex-grow min-h-screen bg-gray-50 dark:bg-gray-900">
      <router-view :key="$route.fullPath" />
    </main>
    <TheFooter />
  </div>
</template>
<script>
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
export default {
  name: 'DefaultLayout',
  components: {
    TheHeader,
    TheFooter,
  },
}
</script>
<style>
.default-layout{
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>