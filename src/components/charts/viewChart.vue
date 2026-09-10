<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-600 w-full max-w-3xl mx-auto"
  >
    <h3 class="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center">
      Ads Views - Last 7 Days
    </h3>

    <div class="flex items-end justify-center sm:justify-between h-56 gap-3 px-2 sm:gap-4 sm:px-6">
      <div
        v-for="day in normalizedData"
        :key="day.name"
        class="flex flex-col items-center flex-1 h-full"
      >
        <!-- العمود -->
        <div class="flex items-end w-full max-w-[30px] sm:max-w-[40px] relative h-full">
          <div
            class="w-full bg-gradient-to-t from-red-600 to-red-500 rounded-t-md relative transition-all duration-700 ease-out min-h-[4px] flex justify-center"
            :style="{ height: day.animatedHeight + '%' }"
            @mouseenter="activeBar = day.name"
            @mouseleave="activeBar = null"
          >
            <!-- التولتيب -->
            <span
              class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none transition-all duration-200"
              :class="{ 'opacity-100 -translate-y-1': activeBar === day.name }"
            >
              {{ day.views }} views
              <span
                class="absolute left-1/2 -bottom-1.5 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
              ></span>
            </span>
          </div>
        </div>
        <!-- اليوم -->
        <span class="mt-2 text-xs font-medium text-gray-500 dark:text-gray-300">{{
          day.name
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeBar: null,
      viewsData: [
        { name: 'Mon', views: 45 },
        { name: 'Tue', views: 78 },
        { name: 'Wed', views: 62 },
        { name: 'Thu', views: 89 },
        { name: 'Fri', views: 95 },
        { name: 'Sat', views: 67 },
        { name: 'Sun', views: 52 },
      ],
      animatedBars: [],
    }
  },
  computed: {
    normalizedData() {
      const maxViews = Math.max(...this.viewsData.map((d) => d.views))
      return this.viewsData.map((d, i) => ({
        ...d,
        percentage: (d.views / maxViews) * 100,
        animatedHeight: this.animatedBars[i] || 0,
      }))
    },
  },
  mounted() {
    this.animateBars()
  },
  methods: {
    animateBars() {
      this.animatedBars = this.viewsData.map(() => 0)
      this.$nextTick(() => {
        const maxViews = Math.max(...this.viewsData.map((d) => d.views))
        this.viewsData.forEach((d, i) => {
          const target = (d.views / maxViews) * 100
          setTimeout(() => {
            this.animatedBars[i] = target
          }, i * 200) // stagger animation
        })
      })
    },
  },
}
</script>
