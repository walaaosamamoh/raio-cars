<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Title and Action Button -->
    <div class="flex justify-between items-center mb-10">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
        {{$t('home.latestCars')}}
      </h2>
      <router-link
        :to="{ name: 'cars' }"
        class="text-primary dark:text-primary-dark font-medium border border-primary dark:border-primary-dark hover:bg-primary dark:hover:bg-primary-dark hover:text-white dark:hover:text-gray-900 transition rounded-md cursor-pointer py-2 px-4 text-sm sm:text-base"
        >{{$t('home.viewAll')}}
      </router-link>
    </div>

    <!-- skeleton loading -->
    <div v-if="adsStore.loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="n in 8"
        :key="n"
        class="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl h-80"
      ></div>
    </div>

    <!-- error state -->
    <div v-else-if="adsStore.error" class="text-center py-10">
      <p class="text-red-500 mb-4">{{ adsStore.error }}</p>
    </div>
    
    <!-- Cars Grid / Scroller -->
    <div v-else>
      <div
        class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth sm:overflow-x-visible sm:grid sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 sm:gap-6"
      >
        <!-- Car Card -->
        <router-link
          :to="{ name: 'carDetails', params: { id: ad.id } }"
          v-for="ad in adsStore.ads.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,8)"
          :key="ad.id"
          class="min-w-[250px] sm:min-w-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <CarCard :ad="ad" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import CarCard from '@/components/cars/CarCard.vue'
import {useAdsStore} from '@/stores/ads.js'
export default {
  name: 'LatestCarsSection',
  components: {
    CarCard,
  },
  data() {
    return {
      adsStore: useAdsStore(),
    }
  },
  mounted(){
    this.adsStore.fetchAds()
  },
  watch: {
    '$i18n.locale'(newLang) {
      this.adsStore.fetchAds(newLang)
    },
  },
}
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
