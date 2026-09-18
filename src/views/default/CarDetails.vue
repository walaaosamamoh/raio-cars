<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>

        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <div class="h-96 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
          </div>

          <div class="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <h2 class="text-2xl font-semibold text-red-600 mb-4">
          {{ error }}
        </h2>

        <button
          type="button"
          @click="fetchCarData($route.params.id)"
          class="px-5 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
        >
          {{ $t('common.retry') }}
        </button>
      </div>

      <!-- Car Details -->
      <div v-else-if="car">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ car.name }}
          </h1>

          <p class="text-gray-500 dark:text-gray-400 mt-2">
            {{ $t('carDetails.posted') }} {{ timeAgo }}
          </p>
        </div>

        <!-- Main Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Image Gallery -->
            <ImageGallery :photos="car.photos || []" />

            <!-- Vehicle Information -->
            <VehicleInfo :details="details" />

            <!-- Description -->
            <div
              class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('carDetails.description') }}
              </h2>

              <p class="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {{ car.description || $t('carDetails.noDescription') }}
              </p>
            </div>
          </div>

          <!-- Seller -->
          <div>
            <SellerCard :seller="seller" :price="car.price" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAdsStore } from '@/stores/ads'
import { carData } from '@/data/carData'
import { advertiserData } from '@/data/advertiserData'
import { statesData } from '@/data/statesData'
import { mapState, mapActions } from 'pinia'

import ImageGallery from '@/components/details/ImageGallery.vue'
import VehicleInfo from '@/components/details/VehicleInfo.vue'
import SellerCard from '@/components/details/SellerCard.vue'

export default {
  name: 'CarDetailsView',

  components: {
    ImageGallery,
    VehicleInfo,
    SellerCard,
  },

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

    carData() {
      return carData
    },

    timeAgo() {
      return this.car?.created_at ? this.$dayjs(this.car.created_at).fromNow() : ''
    },

    details() {
      if (!this.car) return []

      return [
        {
          key: 'odometer',
          label: this.$t('carDetails.odometer'),
          value: this.formatOdometer(this.car.odometer),
        },
        {
          key: 'cylinders',
          label: this.$t('carDetails.cylinders'),
          value: this.getCylinderCount(this.car.cylinders),
        },
        {
          key: 'transmission',
          label: this.$t('carDetails.transmission'),
          value: this.getLocalizedName(this.carData.transmissions, this.car.transmission),
        },
        {
          key: 'keys',
          label: this.$t('carDetails.key'),
          value: this.car.keys,
        },
        {
          key: 'option',
          label: this.$t('carDetails.options'),
          value: this.getLocalizedName(this.carData.options, this.car.option),
        },
        {
          key: 'fuelType',
          label: this.$t('carDetails.fuelType'),
          value: this.getLocalizedName(this.carData.fuelTypes, this.car.fuel_type),
        },
        {
          key: 'driveLine',
          label: this.$t('carDetails.driveLine'),
          value: this.getLocalizedName(this.carData.drivetrains, this.car.drive_line),
        },
        {
          key: 'exteriorColor',
          label: this.$t('carDetails.exteriorColor'),
          value: this.getLocalizedName(this.carData.colors, this.car.exterior_color),
        },
        {
          key: 'interiorColor',
          label: this.$t('carDetails.interiorColor'),
          value: this.getLocalizedName(this.carData.colors, this.car.interior_color),
        },
        {
          key: 'region',
          label: this.$t('carDetails.region'),
          value: this.getRegion(),
        },
      ]
    },

    seller() {
      const advertiser =
        this.car?.advertiser && typeof this.car.advertiser === 'object'
          ? this.car.advertiser
          : advertiserData.find(
              (item) => String(item.id) === String(this.car?.advertiser_id),
            )

      if (!advertiser) {
        return {
          id: null,
          name: this.$t('carDetails.unknownSeller'),
          adsCount: 0,
          followers: 0,
          whatsapp: '',
          phone: '',
          photo: '',
        }
      }

      return {
        id: advertiser.id,
        name: advertiser.name || this.car.advertiser || this.$t('carDetails.unknownSeller'),
        adsCount: advertiser.ads_count || this.car.ads_count || 0,
        followers: advertiser.followers || this.car.followers || 0,
        whatsapp: advertiser.whatsapp || '',
        phone: advertiser.phone || '',
        photo: advertiser.photo || '',
      }
    },
  },

  created() {
    const carId = this.$route.params.id

    this.fetchCarData(carId)
    this.incrementAdView(carId)
  },

  methods: {
    ...mapActions(useAdsStore, ['incrementAdView']),

    getLocalizedName(list, id) {
      if (id === null || id === undefined || id === '') {
        return '-'
      }

      const item = list?.find((item) => String(item.id) === String(id))

      if (!item) {
        return id
      }

      const language = this.$i18n.locale

      if (language === 'ar') {
        return item.name_ar || item.name_en || id
      }

      return item.name_en || item.name_ar || id
    },

    getCylinderCount(id) {
      if (id === null || id === undefined || id === '') {
        return '-'
      }

      const item = this.carData.cylinders.find((item) => String(item.id) === String(id))

      return item ? item.count : id
    },

    formatOdometer(value) {
      if (value === null || value === undefined || value === '') {
        return '-'
      }

      const number = Number(value)

      if (Number.isNaN(number)) {
        return value
      }

      return `${number.toLocaleString(this.$i18n.locale === 'ar' ? 'ar-EG' : 'en-US')} km`
    },

    getRegion() {
      if (!this.car) {
        return '-'
      }

      /*
       * Find the state.
       * car.state contains the state ID.
       */
      const state = statesData.find((item) => String(item.id) === String(this.car.state))

      if (!state) {
        return '-'
      }

      const language = this.$i18n.locale

      const stateName =
        language === 'ar' ? state.name_ar || state.name_en : state.name_en || state.name_ar

      /*
       * Find the city inside the selected state.
       * car.city contains the city ID.
       */
      const city = state.cities?.find((item) => String(item.id) === String(this.car.city))

      if (!city) {
        return stateName
      }

      const cityName =
        language === 'ar' ? city.name_ar || city.name_en : city.name_en || city.name_ar

      return `${cityName}, ${stateName}`
    },

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
        console.error('Error loading car:', err)

        this.error = this.$t('carDetails.loadError')
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
