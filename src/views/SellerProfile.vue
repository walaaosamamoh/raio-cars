<template>
  <div class="min-h-screen">
    <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-8 w-8 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

    <div v-else-if="error" class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span class="block sm:inline">{{ error }}</span>
      </div>
    </div>

    <div v-else>
      <!-- Seller Header Section - Full Width -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <!-- Seller Avatar -->
            <div class="relative">
              <img
                :src="seller.photo"
                :alt="seller.name"
                class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary"
              />
            </div>

            <!-- Seller Info -->
            <div class="flex-1 text-center md:text-left rtl:md:text-right">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {{ seller.name }}
              </h1>

              <!-- Stats -->
              <div class="flex flex-wrap gap-6 justify-center md:justify-start">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-700 dark:text-gray-200">
                    {{ seller.ads_count }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('sellerProfile.ads') }}</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-700 dark:text-gray-200">
                    {{ seller.followers }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('sellerProfile.followers') }}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 mt-4 md:mt-0">
              <!-- Share Button -->
              <button
                @click="shareProfile"
                class="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors duration-300 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span>{{ $t('sellerProfile.share') }}</span>
              </button>

              <!-- follow button -->
              <button
                @click="toggleFollow"
                :class="[
                  'px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-2 w-32 justify-center',
                  isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-primary text-white hover:bg-primary-dark',
                ]"
              >
                <!-- أيقونة + أو ✓ -->
                <svg
                  v-if="!isFollowing"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <!-- نص الزر -->
                <span>{{ isFollowing ? $t('sellerProfile.following') : $t('sellerProfile.follow') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <!-- Left Column - About Section -->
          <div class="sm:col-span-1">
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <!-- About Section -->
              <div class="mb-6">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">{{$t('sellerProfile.about')}}</h2>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {{ seller.about }}
                </p>
              </div>

              <!-- Contact Information -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-5">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
                  {{$t('sellerProfile.contact-info')}}
                </h3>

                <div class="space-y-3">
                  <!-- Phone -->
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('sellerProfile.phone') }}</p>
                      <a
                        :href="`tel:${seller.phone}`"
                        class="text-sm text-gray-900 dark:text-white font-medium hover:text-primary dark:hover:text-primary-dark transition-colors"
                      >
                        {{ seller.phone }}
                      </a>
                    </div>
                  </div>

                  <!-- WhatsApp -->
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center"
                    >
                      <font-awesome-icon
                        :icon="['fab', 'whatsapp']"
                        class="h-4 w-4 text-green-600 dark:text-green-400"
                      />
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{$t('sellerProfile.whatsapp')}}</p>
                      <a
                        :href="`https://wa.me/${seller.whatsapp}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-sm text-gray-900 dark:text-white font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        {{ seller.whatsapp }}
                      </a>
                    </div>
                  </div>

                  <!-- Location -->
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('sellerProfile.location') }}</p>
                      <p class="text-sm text-gray-900 dark:text-white font-medium">
                        {{ seller.state }}, {{ seller.city }}
                      </p>
                    </div>
                  </div>

                  <!-- Member Since -->
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-orange-600 dark:text-orange-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('sellerProfile.member-since') }}</p>
                      <p class="text-sm text-gray-900 dark:text-white font-medium">
                        {{ seller.created_at }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Ads Section -->
          <div class="sm:col-span-1 md:col-span-2 lg:col-span-3">
            <div class="mb-6">
              <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ $t('sellerProfile.all-ads') }}</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {{ sellerAds.length }} {{ $t('sellerProfile.ads-available') }}
              </p>
            </div>

            <!-- Ads Grid باستخدام CarCard -->
            <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <router-link
                :to="{ name: 'carDetails', params: { id: ad.id } }"
                v-for="ad in sellerAds"
                :key="ad.id"
                class="min-w-[250px] sm:min-w-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <CarCard :ad="ad" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CarCard from '@/components/cars/CarCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useAdsStore } from '@/stores/ads'
import { useFollowStore } from '@/stores/followStore'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'SellerProfileView',
  components: {
    CarCard,
  },
  data() {
    return {
      loading: false,
      error: null,
      seller: {}
    }
  },
  computed: {
    ...mapState(useFollowStore, ['isFollowing']),
    authStore() {
      return useAuthStore()
    },
    adsStore() {
      return useAdsStore()
    },
    followStore() {
      return useFollowStore()
    },
    sellerAds() {
      return this.adsStore.ads
    },
  },
  methods: {
    ...mapActions(useAuthStore, ['incrementAdvertiserProfileView']),
    async toggleFollow() {
      const loggedInUserId = this.authStore.advertiserId
      const sellerPageId = this.$route.params.id

      if(!loggedInUserId){
        return
      }

      if(this.isFollowing){
        await this.followStore.unfollowAdvertiser(sellerPageId, loggedInUserId)
        this.seller.followers --
      }else{
        await this.followStore.followAdvertiser(sellerPageId, loggedInUserId)
        this.seller.followers ++
      }
    },
    shareProfile() {
      if (navigator.share) {
        navigator.share({
          title: `Check out ${this.seller.name}'s profile`,
          text: `View ${this.seller.name}'s car ads on our platform`,
          url: window.location.href,
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        alert('Profile link copied to clipboard!')
      }
    },

    async fetchPageData() {
      const sellerId = this.$route.params.id
      this.loading = true
      this.error = null
      try {
        this.seller= await this.authStore.getAdvertiserForView(sellerId)
        console.log(this.seller)
        await this.adsStore.fetchAds({ advertiserId: sellerId })
      } catch (err) {
        this.error = 'Failed to load seller profile. Please try again later.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async checkInitialFollowStatus(){
      const loggedInUserId = this.authStore.advertiserId
      const sellerPageId = this.$route.params.id
      await this.followStore.checkFollowStatus(sellerPageId, loggedInUserId)
    }
  },
  async created() {
    await this.fetchPageData()
    await this.checkInitialFollowStatus()
    await this.incrementAdvertiserProfileView(this.$route.params.id)
  },
  watch: {
  async '$route.params.id'() {
    await this.fetchPageData()
    await this.checkInitialFollowStatus()
    await this.incrementAdvertiserProfileView(this.$route.params.id)
  },
},
}
</script>
