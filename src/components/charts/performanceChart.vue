<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-600 w-full max-w-5xl mx-auto"
  >
    <h3
      class="text-lg sm:text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center md:text-left"
    >
      Top Performing Ads
    </h3>

    <div class="flex flex-col gap-6 w-full">
      <div
        v-for="ad in topAds"
        :key="ad.id"
        class="flex flex-col md:flex-row gap-4 md:gap-6 w-full"
      >
        <!-- Ad name -->
        <span
          class="md:w-[140px] font-medium text-gray-700 dark:text-gray-100 text-sm sm:text-base text-center md:text-left"
        >
          {{ ad.name }}
        </span>

        <!-- Performance + statistics -->
        <div class="flex-1 flex flex-col gap-2">
          <!-- Performance bar -->
          <div
            class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 sm:h-5 relative overflow-hidden"
          >
            <div
              class="h-full rounded-full flex items-center px-2 text-white font-medium text-xs sm:text-sm transition-all duration-1000 ease-out"
              :class="getPerformanceClass(ad.performance)"
              :style="{ width: ad.animatedWidth + '%' }"
            >
              <span class="whitespace-nowrap">
                {{ ad.performance }}%
              </span>
            </div>
          </div>

          <!-- Statistics -->
          <div
            class="flex flex-wrap justify-center md:justify-start gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-200"
          >
            <span
              class="bg-gray-50 dark:bg-gray-600 px-2 py-1 rounded-md"
            >
              {{ ad.views }} {{ $t('dashboard.views') }}
            </span>

            <span
              class="bg-gray-50 dark:bg-gray-600 px-2 py-1 rounded-md"
            >
              {{ ad.shares }} {{ $t('dashboard.shares') }}
            </span>
          </div>
        </div>
      </div>

      <p
        v-if="topAds.length === 0"
        class="text-center text-gray-500 dark:text-gray-300 py-6"
      >
        No ads available.
      </p>
    </div>
  </div>
</template>

<script>
import { adsData } from '@/data/adsData'

export default {
  name: 'PerformanceChart',

  props: {
    advertiserId: {
      type: [String, Number],
      required: true,
    },
  },

  computed: {
    advertiserAds() {
      return adsData.filter(
        (ad) => String(ad.advertiser_id) === String(this.advertiserId),
      )
    },

    topAds() {
      if (!this.advertiserAds.length) return []

      const adsWithScore = this.advertiserAds.map((ad) => {
        const views = Number(ad.views) || 0
        const shares = Number(ad.shares) || 0

        return {
          ...ad,
          views,
          shares,
          score: views + shares * 20,
        }
      })

      const maxScore = Math.max(
        ...adsWithScore.map((ad) => ad.score),
        1,
      )

      return adsWithScore
        .map((ad) => ({
          ...ad,
          performance: Math.round((ad.score / maxScore) * 100),
          animatedWidth: 0,
        }))
        .sort((a, b) => b.performance - a.performance)
        .slice(0, 5)
    },
  },

  mounted() {
    setTimeout(() => {
      this.topAds.forEach((ad) => {
        ad.animatedWidth = ad.performance
      })
    }, 300)
  },

  methods: {
    getPerformanceClass(performance) {
      if (performance >= 80) {
        return 'bg-gradient-to-r from-emerald-500 to-emerald-400'
      }

      if (performance >= 60) {
        return 'bg-gradient-to-r from-blue-500 to-blue-400'
      }

      return 'bg-gradient-to-r from-amber-500 to-amber-400'
    },
  },
}
</script>
