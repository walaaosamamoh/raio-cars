<template>
  <div class="dashboard-page">
    <!-- Stats Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Seller Profile Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center px-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div
          class="flex items-center space-x-4"
          :class="$i18n.locale === 'ar' ? 'space-x-reverse' : ''"
        >
          <img
            :src="auth.advertiser.photo"
            class="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
          />
          <h3 class="font-semibold text-lg dark:text-white">{{ auth.advertiser.name }}</h3>
        </div>
      </div>

      <!-- Ads Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {{ $t('dashboard.active-ads') }}
          </h3>
          <span
            class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
            >{{ $t('dashboard.dashboard-plan') }}</span
          >
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ ads.length }}<small class="text-sm text-gray-500 dark:text-gray-400 ml-1">/5</small>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
          <div
            class="bg-green-500 h-2 rounded-full transition-all duration-500"
            :style="{ width: (ads.length / 5) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- Followers Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">
          {{ $t('dashboard.followers') }}
        </h3>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ followersCount }}</div>
        <div class="flex items-center text-sm text-green-600 dark:text-green-400 mt-2">
          <font-awesome-icon icon="arrow-up" class="w-3 h-3 mr-1" />
          <span> 12% {{ $t('dashboard.this_month') }}</span>
        </div>
      </div>

      <!-- Views Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">
          {{ $t('dashboard.views') }}
        </h3>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ viewsCount }}</div>
        <div class="flex items-center text-sm text-blue-600 dark:text-blue-400 mt-2">
          <font-awesome-icon icon="arrow-up" class="w-3 h-3 mr-1" />
          <span>8% {{ $t('dashboard.this_week') }}</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Views Chart -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('dashboard.views-analytics') }}
        </h3>
        <viewChart :advertiser-id="auth.advertiserId" />
      </div>

      <!-- Performance Chart -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('dashboard.performance') }}
        </h3>
        <performanceChart :advertiser-id="auth.advertiserId" />
      </div>
    </div>

    <!-- Recent Ads Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <!-- Header with Create Button -->
      <div
        class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('dashboard.recent_ads') }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {{ $t('dashboard.recent_ads_desc') }}
          </p>
        </div>

        <!-- display only when there is ad -->
        <router-link
          v-if="hasAds"
          to="/create-ad"
          class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <font-awesome-icon icon="plus" />
          <span>{{ $t('dashboard.create-new-ad') }}</span>
        </router-link>
      </div>

      <!-- Ads Content -->
      <div class="p-6">
        <!-- if ads -->
        <div v-if="hasAds">
          <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            <router-link
              v-for="ad in ads"
              :key="ad.id"
              :to="{ name: 'carDetails', params: { id: ad.id } }"
            >
              <CarCard :ad="ad" />
            </router-link>
          </div>
        </div>

        <!-- if no ads -->
        <div v-else class="text-center py-12">
          <font-awesome-icon icon="car" class="text-4xl text-gray-300 dark:text-gray-600 mb-4" />
          <h4 class="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            {{ $t('dashboard.no_ads_title') }}
          </h4>
          <p class="text-gray-400 dark:text-gray-500 mb-4">{{ $t('dashboard.no_ads_desc') }}</p>
          <router-link
            to="/create-ad"
            class="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-lg"
          >
            <font-awesome-icon icon="plus" class="mr-2" />
            {{ $t('dashboard.create_first_ad') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useAdsStore } from '@/stores/ads'
import { useDashboardStore } from '@/stores/dashboard'
import { mapState, mapActions } from 'pinia'
import CarCard from '@/components/cars/CarCard.vue'
import viewChart from '@/components/charts/viewChart.vue'
import performanceChart from '@/components/charts/performanceChart.vue'

export default {
  name: 'SellerDashboard',

  components: {
    viewChart,
    performanceChart,
    CarCard,
  },

  data() {
    return {
      auth: useAuthStore(),
      adsStore: useAdsStore(),
    }
  },

  computed: {
    ...mapState(useDashboardStore, [
      'viewsCount',
      'followersCount',
    ]),

    ads() {
      return this.adsStore.ads.slice(0, 5)
    },

    hasAds() {
      return this.ads.length > 0
    },
  },

  methods: {
    ...mapActions(useDashboardStore, [
      'fetchViewsCount',
      'fetchFollowersCount',
    ]),

    async fetchDashboardData() {
      const advertiserId = this.auth.advertiserId

      if (!advertiserId) {
        console.error(
          'User is not properly authenticated. Redirecting to login.',
        )

        this.$router.push({ name: 'signin' })
        return
      }

      try {
        // Get advertiser from local data
        await this.auth.getAdvertiser(advertiserId)

        // Get advertiser's ads from local data
        await this.adsStore.fetchAds({
          advertiserId,
        })

        // Get dashboard statistics from local data
        await this.fetchViewsCount(advertiserId)
        await this.fetchFollowersCount(advertiserId)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      }
    },
  },

  async mounted() {
    await this.fetchDashboardData()
  },
}
</script>
