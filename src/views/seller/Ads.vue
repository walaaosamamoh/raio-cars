<template>
  <div class="seller-ads-page p-4 lg:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('seller_ads.title') }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
              {{ $t('seller_ads.subtitle') }}
            </p>
          </div>
          <router-link
            to="/create-ad"
            class="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            {{ $t('seller_ads.create_new') }}
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
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
        <p class="text-gray-600 dark:text-gray-400">{{ $t('seller_ads.loading') }}</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
      >
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
        <button
          @click="fetchAds"
          class="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          {{ $t('seller_ads.retry') }}
        </button>
      </div>

      <!-- Ads Table -->
      <div
        v-else-if="ads.length > 0"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-visible border-gray-200 dark:border-gray-700"
      >
        <!-- Table Container with Horizontal Scroll -->
        <div class="overflow-x-auto rounded-lg">
          <table class="min-w-full table-auto">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-4 py-3 text-xs text-center font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {{ $t('seller_ads.car_info') }}
                </th>
                <th
                  class="px-4 py-3 text-xs text-center font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {{ $t('seller_ads.price') }}
                </th>
                <th
                  class="px-4 py-3 text-xs text-center font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {{ $t('seller_ads.transmission') }}
                </th>
                <th
                  class="px-4 py-3 text-xs text-center font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {{ $t('seller_ads.drive_line') }}
                </th>
                <th
                  class="px-4 py-3 text-xs text-center font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {{ $t('seller_ads.status') }}
                </th>
                <th
                  class="px-4 py-3 text-xs text-center font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {{ $t('seller_ads.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="ad in paginatedAds"
                :key="ad.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <!-- Car Info -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <!-- Car Image -->
                    <div
                      class="flex-shrink-0 h-10 w-12 sm:h-12 sm:w-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden"
                    >
                      <img
                        v-if="ad.featured_image"
                        :src="ad.featured_image"
                        :alt="ad.make + ' ' + ad.model"
                        class="h-full w-full object-cover"
                      />
                      <div
                        v-else
                        class="h-full w-full flex items-center justify-center text-gray-400"
                      >
                        <svg
                          class="w-4 h-4 sm:w-6 sm:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <!-- Car Details -->
                    <div class="min-w-0">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ ad.make }} {{ ad.model }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ ad.year }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Price -->
                <td class="px-4 py-4 text-center whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatPrice(ad.price) }} SDG
                  </div>
                </td>

                <!-- Transmission -->
                <td class="px-4 py-4 text-center whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ ad.transmission || $t('seller_ads.not_specified') }}
                  </div>
                </td>

                <!-- Drivetrain -->
                <td class="px-4 py-4 text-center whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ ad.drive_line || $t('seller_ads.not_specified') }}
                  </div>
                </td>

                <!-- Status -->
                <td class="px-4 py-4 text-center whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      getStatusClass(ad.status),
                    ]"
                  >
                    {{ getStatusText(ad.status) }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex items-center justify-center gap-1 sm:gap-2">
                    <button
                      @click="viewAd(ad.id)"
                      class="text-primary hover:text-primary-dark transition-colors p-1"
                      :title="$t('seller_ads.view')"
                    >
                      <svg
                        class="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                    </button>

                    <button
                      @click="editAd(ad.id)"
                      class="text-blue-600 hover:text-blue-800 transition-colors p-1"
                      :title="$t('seller_ads.edit')"
                    >
                      <svg
                        class="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>

                    <button
                      @click="deleteAd(ad.id)"
                      class="text-red-600 hover:text-red-800 transition-colors p-1"
                      :title="$t('seller_ads.delete')"
                    >
                      <svg
                        class="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="ads.length === 0" class="text-center py-12">
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            ></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ $t('seller_ads.no_ads_title') }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">
            {{ $t('seller_ads.no_ads_description') }}
          </p>
          <router-link
            to="/seller/create-ad"
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            {{ $t('seller_ads.create_first') }}
          </router-link>
        </div>

        <!-- Pagination -->
        <div
          v-if="ads.length > 0"
          class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <!-- Page Info -->
            <div class="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
              {{ $t('seller_ads.showing') }}
              <span class="font-medium">{{ startIndex + 1 }}</span>
              {{ $t('seller_ads.to') }}
              <span class="font-medium">{{ endIndex }}</span>
              {{ $t('seller_ads.of') }}
              <span class="font-medium">{{ ads.length }}</span>
              {{ $t('seller_ads.results') }}
            </div>

            <!-- Pagination Controls -->
            <div class="flex items-center justify-center gap-2">
              <!-- Previous Button -->
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                :class="[
                  'px-3 py-1 rounded border text-sm transition-colors',
                  currentPage === 1
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
                ]"
              >
                {{ $t('seller_ads.previous') }}
              </button>

              <!-- Page Numbers -->
              <div class="flex items-center gap-1">
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'w-8 h-8 rounded text-sm transition-colors',
                    page === currentPage
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                  ]"
                >
                  {{ page }}
                </button>
              </div>

              <!-- Next Button -->
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                :class="[
                  'px-3 py-1 rounded border text-sm transition-colors',
                  currentPage === totalPages
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
                ]"
              >
                {{ $t('seller_ads.next') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State (when no ads at all) -->
      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center py-12"
      >
        <svg
          class="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          ></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ $t('seller_ads.no_ads_title') }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          {{ $t('seller_ads.no_ads_description') }}
        </p>
        <router-link
          to="/seller/create-ad"
          class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          {{ $t('seller_ads.create_first') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useAdsStore } from '@/stores/ads'
import { adsData } from '@/data/adsData'
import { toastService } from '@/services/toastService'
import { swalMixin } from '@/mixins/swalMixin'
import Swal from 'sweetalert2'

export default {
  name: 'SellerAdsPage',

  mixins: [swalMixin],

  data() {
    return {
      auth: useAuthStore(),
      adsStore: useAdsStore(),
      loading: false,
      error: null,
      ads: [],
      currentPage: 1,
      pageSize: 5,
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.ads.length / this.pageSize)
    },

    paginatedAds() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize

      return this.ads.slice(start, end)
    },

    startIndex() {
      return (this.currentPage - 1) * this.pageSize
    },

    endIndex() {
      return Math.min(this.currentPage * this.pageSize, this.ads.length)
    },
  },

  async mounted() {
    await this.fetchAds()
  },

  methods: {
    async fetchAds() {
      this.loading = true
      this.error = null

      try {
        const advertiserId = this.auth.advertiserId

        if (!advertiserId) {
          throw new Error('You must be logged in to view your ads.')
        }

        this.ads = adsData.filter((ad) => String(ad.advertiser_id) === String(advertiserId))

        this.currentPage = 1
      } catch (error) {
        console.error('Error fetching ads:', error)

        this.error = error.message || 'Failed to fetch ads'

        toastService.error('Failed to load ads')
      } finally {
        this.loading = false
      }
    },

    deleteAd(adId) {

      this.$swalConfirm('Delete this ad?', 'This action cannot be undone.', 'delete').then(
        (result) => {
          if (result.isConfirmed) {
            this.confirmDelete(adId)
          }
        },
      )
    },

    async confirmDelete(adId) {
      const isDark = document.documentElement.classList.contains('dark')

      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait while we delete your ad',
        allowOutsideClick: false,
        background: isDark ? '#1f2937' : '#fff',
        color: isDark ? '#fff' : '#000',

        didOpen: () => {
          Swal.showLoading()
        },
      })

      try {
        const success = await this.adsStore.deleteAd(adId)

        if (!success) {
          throw new Error(this.adsStore.error || 'Failed to delete ad.')
        }

        this.ads = this.ads.filter((ad) => ad.id !== adId)

        Swal.close()

        toastService.success('Your ad has been deleted successfully.')

        // If the current page becomes empty after deleting
        // the last item, move to the previous page.
        if (this.paginatedAds.length === 0 && this.currentPage > 1) {
          this.currentPage--
        }
      } catch (error) {
        Swal.close()

        console.error('Error deleting ad:', error)

        toastService.error('Failed to delete ad. Please try again.')
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat('en-US').format(price)
    },

    getStatusClass(status) {
      const classes = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',

        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',

        rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',

        draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      }

      return classes[status] || classes.draft
    },

    getStatusText(status) {
      const texts = {
        active: 'Active',
        pending: 'Under Review',
        rejected: 'Rejected',
        draft: 'Draft',
      }

      return texts[status] || status
    },

    viewAd(adId) {
      this.$router.push({
        name: 'sellerCarDetails',
        params: {
          id: adId,
        },
      })
    },

    editAd(adId) {
      this.$router.push(`/edit-ad/${adId}`)
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    goToPage(page) {
      this.currentPage = page
    },
  },
}
</script>

<style scoped>
.seller-ads-page {
  position: relative;
  width: 100% !important;
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

.seller-ads-page * {
  box-sizing: border-box;
}

/* تحسين السكرول للجدول فقط */
.overflow-x-auto {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* لسلاسة السكرول على الموبايل */
}

/* إخفاء سكرول بار في بعض المتصفحات */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* تحسينات للشاشات الصغيرة جداً */
@media (max-width: 640px) {
  .seller-ads-page .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .seller-ads-page .text-sm {
    font-size: 0.75rem;
  }

  .seller-ads-page .min-w-full {
    min-width: 600px; /* أدنى عرض للجدول */
  }
}

/* تحسينات للشاشات المتوسطة */
@media (max-width: 768px) {
  .seller-ads-page .gap-1 {
    gap: 0.25rem;
  }

  .seller-ads-page .p-1 {
    padding: 0.25rem;
  }
}
</style>
