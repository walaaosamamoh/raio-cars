<template>
  <div
    class="make-section relative py-12 container mx-auto px-4 md:px-12 text-center"
    :dir="direction"
  >
    <!-- title -->
    <h2 class="md:text-3xl text-2xl font-bold mb-10 text-gray-800 dark:text-white">
      {{ $t('home.makesTitle') }}
    </h2>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto"
    >
      <div
        v-for="n in 10"
        :key="n"
        class="animate-pulse p-4 bg-gray-200 dark:bg-gray-800 rounded-xl h-[150px] flex flex-col items-center justify-center"
      >
        <div class="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div class="h-4 mt-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-500 mb-4">Something went wrong while fetching data.</p>
    </div>

    <!-- Slider -->
    <template v-else-if="makes && makes.length > 0">
      <Swiper
        :modules="[Grid, Navigation, Pagination]"
        :dir="direction"
        :slides-per-view="2"
        :slides-per-group="2"
        :space-between="24"
        :grid="{ rows: 2, fill: 'row' }"
        :breakpoints="{
          640: { slidesPerView: 3, slidesPerGroup: 3, grid: { rows: 2 } },
          768: { slidesPerView: 4, slidesPerGroup: 4, grid: { rows: 2 } },
          1024: { slidesPerView: 5, slidesPerGroup: 5, grid: { rows: 2 } },
        }"
        :navigation="{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }"
        :pagination="{
          el: '.swiper-pagination-custom',
          clickable: true,
        }"
        class="max-w-6xl mx-auto pb-16"
      >
        <SwiperSlide
          v-for="(make, index) in paddedMakes"
          :key="`make.id || placeholder-${index}`"
          :class="[
            'group p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center',
            !make.id ? 'invisible' : '',
          ]"
          @click="make.id ? $router.push({ name: 'cars', query: { make: make.id } }) : null"
          :style="{ cursor: make.id ? 'pointer' : 'default' }"
        >
          <template v-if="make.id">
            <div
              class="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 transition-colors duration-300"
            >
              <img :src="make.logo" :alt="make.name" class="h-10 w-auto object-contain m-auto" />
            </div>
            <p
              class="mt-4 text-base font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors duration-300"
            >
              {{ make.name }}
            </p>
          </template>
        </SwiperSlide>
      </Swiper>

      <!-- custom swiper buttons (RTL/LTR aware) -->
      <div
        class="swiper-button-prev-custom hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow hover:shadow-lg transition-all duration-300"
        :class="isRTL ? 'right-0' : 'left-0'"
      >
        <!-- Arrow points left for LTR, right for RTL -->
        <svg
          class="h-6 w-6 text-gray-800 dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          :style="isRTL ? 'transform: scaleX(-1);' : ''"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <div
        class="swiper-button-next-custom hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow hover:shadow-lg transition-all duration-300"
        :class="isRTL ? 'left-0' : 'right-0'"
      >
        <!-- Arrow points right for LTR, left for RTL -->
        <svg
          class="h-6 w-6 text-gray-800 dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          :style="isRTL ? 'transform: scaleX(-1);' : ''"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <!-- Pagination -->
      <div class="swiper-pagination-custom"></div>
    </template>

    <div v-else class="text-center py-10">
      <p>No makes available at the moment.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useMakesStore } from '@/stores/makes'
import { Grid, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default {
  name: 'MakeSection',
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      Grid,
      Navigation,
      Pagination,
    }
  },
  computed: {
    ...mapState(useMakesStore, ['makes', 'loading', 'error']),
    direction() {
      return this.$i18n.locale === 'ar' ? 'rtl' : 'ltr'
    },
    isRTL() {
      return this.direction === 'rtl'
    },

    // function to pad makes array with empty objects to fill the grid
    paddedMakes() {
      if (!this.makes || this.makes.length === 0) {
        return []
      }

      const itemsPerPage = 8
      const remainder = this.makes.length % itemsPerPage

      if (remainder === 0) {
        return this.makes
      }

      const placeholdersNeeded = itemsPerPage - remainder
      const placeholders = Array(placeholdersNeeded).fill({})

      return [...this.makes, ...placeholders]
    },
  },
}
</script>

<style lang="postcss">
.swiper-button-next,
.swiper-button-prev {
  display: none;
}

.swiper-pagination-custom {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  width: 100%;
}

.swiper-pagination-custom .swiper-pagination-bullet {
  @apply bg-gray-300 dark:bg-gray-600 opacity-70 transition-all duration-300;
}

.swiper-pagination-custom .swiper-pagination-bullet-active {
  @apply bg-primary dark:bg-primary opacity-100 scale-125;
}

.swiper-slide {
  height: 150px;
  @apply flex flex-col justify-center items-center;
}
</style>
