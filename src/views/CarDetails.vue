<template>
  <!-- Main container -->
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div class="container mx-auto px-4 py-8">

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
            <div class="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
          </div>
          <div class="lg:col-span-1">
            <div class="h-80 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
          </div>
        </div>
      </div>

      <!-- Error message (API or 404) -->
      <div v-else-if="error" class="text-center py-20">
        <h2 class="text-2xl font-bold text-red-500 dark:text-red-400">
          {{ error }}
        </h2>
        <p class="text-gray-500 mt-2">
          {{ isNotFound ? $t('carDetails.notFoundMessage') : $t('carDetails.generalErrorMessage') }}
        </p>
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link
            :to="{ name: 'cars' }"
            class="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition"
          >
            {{ $t('carDetails.backToCars') }}
          </router-link>
          <button
            v-if="!isNotFound"
            @click="fetchCarData($route.params.id)"
            class="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            {{ $t('carDetails.retry') }}
          </button>
        </div>
      </div>

      <!-- Car Details -->
      <div v-else-if="car">
        <div class="mb-6">
          <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            {{ car.name }}
          </h1>
          <div class="flex items-center text-gray-500 dark:text-gray-400 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 me-2" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p class="text-sm">{{ $t('carDetails.posted') }} {{ timeAgo }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <ImageGallery :photos="car.photos" />
            <VehicleInfo :details="details" />

            <!-- Description -->
            <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{{ $t('carDetails.description') }}</h2>
              <div class="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {{ car.description }}
              </div>
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="sticky top-8">
              <SellerCard :seller="seller" :price="car.price" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAdsStore } from '@/stores/ads'
import { mapState,mapActions } from 'pinia'
import ImageGallery from '@/components/details/ImageGallery.vue'
import VehicleInfo from '@/components/details/VehicleInfo.vue'
import SellerCard from '@/components/details/SellerCard.vue'

export default {
  name: 'CarDetailsView',
  components: { ImageGallery, VehicleInfo, SellerCard },
  data() {
    return {
      car: null,
      isLoading: false,
      error: null,
      isNotFound: false,
    }
  },
  computed: {
    ...mapState(useAdsStore, ['currentAd']),
    timeAgo() {
      return this.car?.created_at ? this.$dayjs(this.car?.created_at).fromNow() : ''
    },
    details() {
      return {
        'carDetails.odometer': this.car?.odometer || this.$t('carDetails.notAvailable'),
        'carDetails.cylinders': this.car?.cylinders || this.$t('carDetails.notAvailable'),
        'carDetails.transmission': this.car?.transmission || this.$t('carDetails.notAvailable'),
        'carDetails.key': this.car?.keys || this.$t('carDetails.notAvailable'),
        'carDetails.options': this.car?.option || this.$t('carDetails.notAvailable'),
        'carDetails.fuelType': this.car?.fuel_type || this.$t('carDetails.notAvailable'),
        'carDetails.driveLine': this.car?.drive_line || this.$t('carDetails.notAvailable'),
        'carDetails.exteriorColor': this.car?.exterior_color || this.$t('carDetails.notAvailable'),
        'carDetails.interiorColor': this.car?.interior_color || this.$t('carDetails.notAvailable'),
        'carDetails.region': (this.car?.city && this.car?.state) ? `${this.car.city}, ${this.car.state}` : this.$t('carDetails.notAvailable'),
      }
    },
    seller(){
      return {
        id: this.car?.advertiser_id || '',
        name: this.car?.advertiser || this.$t('carDetails.unknownSeller'),
        adsCount: this.car?.ads_count || 0,
        followers: this.car?.followers || 0,
        whatsapp: this.car?.whatsapp || '',
        phone: this.car?.phone || '',
        photo: this.car?.advertiser_photo || '' ,
      }
    }
  },
  created() {
    const carId = this.$route.params.id
    this.fetchCarData(carId)
    this.incrementAdView(carId)
  },
  methods: {
    ...mapActions(useAdsStore, ['incrementAdView']),
    async fetchCarData(id) {
      const adsStore = useAdsStore()
      this.isLoading = true
      this.error = null
      this.isNotFound = false
      this.car = null

      try {
        const data = await adsStore.fetchAdById(id)
        if (!data) {
          this.isNotFound = true
          this.error = '404 - Not Found'
          return
        }
        this.car = data
      } catch (err) {
        if (err.response?.status === 404) {
          this.isNotFound = true
          this.error = '404 - Not Found'
        } else {
          this.error = err.response?.data?.error || this.$t('carDetails.loadError')
        }
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
