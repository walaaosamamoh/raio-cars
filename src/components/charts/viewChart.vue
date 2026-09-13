<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-600 w-full max-w-3xl mx-auto"
  >
    <h3
      class="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center"
    >
      Ads Views - Last 7 Days
    </h3>

    <div
      class="flex items-end justify-center sm:justify-between h-56 gap-3 px-2 sm:gap-4 sm:px-6"
    >
      <div
        v-for="day in normalizedData"
        :key="day.date"
        class="flex flex-col items-center flex-1 h-full"
      >
        <!-- Bar -->
        <div
          class="flex items-end w-full max-w-[30px] sm:max-w-[40px] relative h-full"
        >
          <div
            class="w-full bg-gradient-to-t from-red-600 to-red-500 rounded-t-md relative transition-all duration-700 ease-out min-h-[4px] flex justify-center"
            :style="{ height: `${day.animatedHeight}%` }"
            @mouseenter="activeBar = day.date"
            @mouseleave="activeBar = null"
          >
            <!-- Tooltip -->
            <span
              class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none transition-all duration-200 whitespace-nowrap"
              :class="{
                'opacity-100 -translate-y-1': activeBar === day.date,
              }"
            >
              {{ day.views }} views

              <span
                class="absolute left-1/2 -bottom-1.5 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
              ></span>
            </span>
          </div>
        </div>

        <!-- Day -->
        <span
          class="mt-2 text-xs font-medium text-gray-500 dark:text-gray-300"
        >
          {{ day.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { adsData } from '@/data/adsData'

export default {
  name: 'ViewChart',

  props: {
    advertiserId: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      activeBar: null,
      animatedBars: [],
      animationTimers: [],
    }
  },

  computed: {
    // Get only the ads belonging to the current advertiser
    advertiserAds() {
      return adsData.filter(
        (ad) =>
          String(ad.advertiser_id) === String(this.advertiserId),
      )
    },

    // Get views for each of the last 7 days
    viewsData() {
      const days = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date()

        date.setDate(date.getDate() - i)

        const dateString = date.toISOString().split('T')[0]

        const views = this.advertiserAds.reduce((total, ad) => {
          const history = ad.viewsHistory || []

          const dayViews = history.find(
            (item) => item.date === dateString,
          )

          return total + Number(dayViews?.views || 0)
        }, 0)

        days.push({
          date: dateString,
          name: date.toLocaleDateString('en-US', {
            weekday: 'short',
          }),
          views,
        })
      }

      return days
    },

    // Convert views to percentages for the chart height
    normalizedData() {
      const maxViews = Math.max(
        ...this.viewsData.map((day) => day.views),
        1,
      )

      return this.viewsData.map((day, index) => ({
        ...day,
        percentage: (day.views / maxViews) * 100,
        animatedHeight: this.animatedBars[index] || 0,
      }))
    },
  },

  watch: {
    advertiserId() {
      this.animateBars()
    },

    viewsData: {
      deep: true,
      handler() {
        this.animateBars()
      },
    },
  },

  mounted() {
    this.animateBars()
  },

  beforeUnmount() {
    this.clearAnimationTimers()
  },

  methods: {
    clearAnimationTimers() {
      this.animationTimers.forEach((timer) => {
        clearTimeout(timer)
      })

      this.animationTimers = []
    },

    animateBars() {
      this.clearAnimationTimers()

      this.animatedBars = this.viewsData.map(() => 0)

      this.$nextTick(() => {
        const maxViews = Math.max(
          ...this.viewsData.map((day) => day.views),
          1,
        )

        this.viewsData.forEach((day, index) => {
          const target = (day.views / maxViews) * 100

          const timer = setTimeout(() => {
            this.animatedBars[index] = target
          }, index * 200)

          this.animationTimers.push(timer)
        })
      })
    },
  },
}
</script>
