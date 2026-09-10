<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-600 w-full max-w-5xl mx-auto">
    <h3 class="text-lg sm:text-xl text-center font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center md:text-left">
      Top Performing Ads
    </h3>

    <div class="flex flex-col gap-6 w-full">
      <div 
        v-for="ad in topAds" 
        :key="ad.id" 
        class="flex flex-col md:flex-row gap-4 md:gap-6 w-full"
      >
        <!-- اسم الاعلان -->
        <span class="md:w-[140px] font-medium text-gray-700 dark:text-gray-100 text-sm sm:text-base text-center md:text-left">
          {{ ad.name }}
        </span>

        <!-- الشريط + الاحصائيات -->
        <div class="flex-1 flex flex-col gap-2">
          <!-- شريط الأداء -->
          <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 sm:h-5 relative overflow-hidden">
            <div 
              class="h-full rounded-full flex items-center px-2 text-white font-medium text-xs sm:text-sm transition-all duration-1000 ease-out"
              :class="getPerformanceClass(ad.performance)"
              :style="{ width: ad.animatedWidth + '%' }"
            >
              <span class="whitespace-nowrap">{{ ad.performance }}%</span>
            </div>
          </div>

          <!-- الإحصائيات -->
          <div class="flex flex-wrap justify-center md:justify-start gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-200">
            <span class="bg-gray-50 dark:bg-gray-600 px-2 py-1 rounded-md">{{ ad.views }} {{$t('dashboard.views')}}</span>
            <span class="bg-gray-50 dark:bg-gray-600 px-2 py-1 rounded-md">{{ ad.shares }} {{$t('dashboard.shares')}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      topAds: [
        { id: 1, name: 'Toyota Camry', views: 1200, shares: 15, performance: 92, animatedWidth: 0 },
        { id: 2, name: 'BMW X5', views: 800, shares: 12, performance: 85, animatedWidth: 0 },
        { id: 3, name: 'Honda Civic', views: 1500, shares: 18, performance: 78, animatedWidth: 0 },
        { id: 4, name: 'Mercedes C300', views: 950, shares: 8, performance: 65, animatedWidth: 0 },
        { id: 5, name: 'Audi A4', views: 600, shares: 5, performance: 45, animatedWidth: 0 }
      ]
    }
  },
  mounted() {
    this.topAds.forEach(ad => {
      setTimeout(() => {
        ad.animatedWidth = ad.performance
      }, 300)
    })
  },
  methods: {
    getPerformanceClass(performance) {
      if (performance >= 80) return 'bg-gradient-to-r from-emerald-500 to-emerald-400'
      if (performance >= 60) return 'bg-gradient-to-r from-blue-500 to-blue-400'
      return 'bg-gradient-to-r from-amber-500 to-amber-400'
    }
  }
}
</script>