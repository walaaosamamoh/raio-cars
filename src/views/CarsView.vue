<template>
  <div class="mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <!-- Desktop Sidebar -->
      <aside class="hidden md:block md:col-span-1">
        <CarsFilterSidebar
          :key="sidebarKey"
          :makes="makes"
          :models="availableModels"
          :min-price="minPrice"
          :max-price="maxPrice"
          :filters="filters"
          @update-filters="onUpdateFilters"
        />
      </aside>

      <!-- Mobile Filter Drawer -->
      <MobileFilterDrawer :isOpen="showFilters" @close="showFilters = false">
        <CarsFilterSidebar
          :key="sidebarKey"
          :makes="makes"
          :models="availableModels"
          :min-price="minPrice"
          :max-price="maxPrice"
          :filters="filters"
          @update-filters="onUpdateFilters"
        />
      </MobileFilterDrawer>

      <!-- Main Content Area -->
      <main class="md:col-span-2 lg:col-span-3">
        <!-- Header with Filters Button and Sorting -->
        <div class="flex justify-between items-center mb-6">
          <!-- Mobile Filter Button -->
          <button
            class="md:hidden flex items-center text-sm shadow-sm border rounded-md w-fit px-3 py-2 transition-colors duration-300 border-primary bg-white text-gray-700 hover:bg-gray-50 dark:border-primary-dark dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            @click="showFilters = true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 inline-block me-2 text-primary dark:text-primary-dark"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ $t('carsView.filters') }}
          </button>

          <!-- Sorting -->
          <div class="relative flex items-center">
            <select
              v-model="sortBy"
              class="appearance-none border rounded text-sm p-2 pe-8 shadow-sm outline-none transition-colors border-primary bg-white text-gray-700 hover:bg-gray-50 dark:border-primary-dark dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <option value="newest">{{ $t('carsView.newest') }}</option>
              <option value="oldest">{{ $t('carsView.oldest') }}</option>
              <option value="priceLow">{{ $t('carsView.priceLow') }}</option>
              <option value="priceHigh">{{ $t('carsView.priceHight') }}</option>
            </select>

            <div class="absolute inset-y-0 end-0 flex items-center px-2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-primary dark:text-primary-dark"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Cars Grid -->
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <router-link
            v-for="ad in displayedAds"
            :key="ad.id"
            :to="{ name: 'carDetails', params: { id: ad.id } }"
          >
            <CarCard :ad="ad" />
          </router-link>
        </div>

        <!-- No Results -->
        <div v-if="displayedAds.length === 0" class="text-center py-12">
          <div class="text-gray-500 dark:text-gray-400 text-lg mb-4">{{$t('carsView.no_cars')}}</div>
          <button
            @click="resetAllFilters"
            class="text-primary dark:text-primary-dark hover:underline"
          >
            {{$t('carsView.reset_filters')}}
          </button>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import CarsFilterSidebar from '@/components/cars/CarsFilterSidebar.vue'
import MobileFilterDrawer from '@/components/cars/MobileFilterDrawer.vue'
import CarCard from '@/components/cars/CarCard.vue'
import { mapState, mapActions } from 'pinia'
import { useMakesStore } from '@/stores/makes'
import { useAdsStore } from '@/stores/ads.js'
import { useCarDataStore } from '@/stores/carDataStore'

export default {
  name: 'CarsView',
  components: { CarsFilterSidebar, CarCard, MobileFilterDrawer },

  data() {
    return {
      filterTimeout: null,
      sidebarKey: 0,
      showFilters: false,
      sortBy: 'newest',
      filters: {
        makes: [],
        models: [],
        transmission: [],
        driveLine: [],
        fuel: [],
        cylinders: [],
        exterior: [],
        interior: [],
        state: [],
        city: [],
        yearFrom: null,
        yearTo: null,
        priceFrom: null,
        priceTo: null,
      },
    }
  },

  computed: {
    ...mapState(useMakesStore, ['makes']),
    ...mapState(useAdsStore, { displayedAds: 'ads' }),
    ...mapState(useCarDataStore, { availableModels: 'models' }),

    adsStore() {
      return useAdsStore()
    },
    carDataStore() {
      return useCarDataStore()
    },

    minPrice() {
      return this.displayedAds.length > 0
        ? Math.min(...this.displayedAds.map((car) => car.price))
        : 0
    },
    maxPrice() {
      return this.displayedAds.length > 0
        ? Math.max(...this.displayedAds.map((car) => car.price))
        : 100000
    },
  },

  methods: {
    ...mapActions(useMakesStore, ['fetchMakes']),

    onUpdateFilters(newFilters) {
      try {
        const current = JSON.stringify(this.filters || {})
        const incoming = JSON.stringify(newFilters || {})
        if (current !== incoming) {
          this.filters = newFilters
        }
      } catch (e) {
        // fallback to simple assignment if stringify fails for some reason
        this.filters = newFilters
        console.log(e);
      }
    },

    // Central function to fetch ads based on the current state of filters
    applyAndFetch() {
      clearTimeout(this.filterTimeout)
      this.filterTimeout = setTimeout(() => {
        // When sending to API, take the first item from the array, or an empty string
        const makeIdToSend = this.filters.makes.length > 0 ? this.filters.makes[0] : ''
        const modelIdToSend = this.filters.models.length > 0 ? this.filters.models[0] : ''

        this.adsStore.fetchAds({
          lang: localStorage.getItem('language') || 'en',
          make: makeIdToSend,
          model: modelIdToSend,
          min_price: this.filters.priceFrom || '',
          max_price: this.filters.priceTo || '',
          sort_order: this.sortByToSortOrder(),
          transmission: this.filters.transmission.join(',') || '',
          drive_line: this.filters.driveLine.join(',') || '',
          fuel: this.filters.fuel.join(',') || '',
          cylinders: this.filters.cylinders.join(',') || '',
          exterior: this.filters.exterior.join(',') || '',
          interior: this.filters.interior.join(',') || '',
          state: this.filters.state.join(',') || '',
          city: this.filters.city.join(',') || '',
          year_from: this.filters.yearFrom || '',
          year_to: this.filters.yearTo || '',
        })
      })
    },

    // Helper to convert sortBy value to API sort_order parameter
    sortByToSortOrder() {
      switch (this.sortBy) {
        case 'oldest':
          return 'asc'
        case 'priceLow':
          return 'price_asc'
        case 'priceHigh':
          return 'price_desc'
        default:
          return 'desc' // 'newest'
      }
    },

    // Resets all filters to their default state
    resetAllFilters() {
      this.filters = {
        makes: [],
        models: [],
        transmission: [],
        driveLine: [],
        fuel: [],
        cylinders: [],
        exterior: [],
        interior: [],
        state: [],
        city: [],
        yearFrom: null,
        yearTo: null,
        priceFrom: null,
        priceTo: null,
      }
      // The watcher on filters will automatically trigger a re-fetch
    },
  },

  async created() {
    // 1. Fetch makes first, so we can map names to IDs if needed
    await this.fetchMakes()

    // 2. Get filter values from the initial route query
    const makeNameFromQuery = this.$route.query.make || null
    const modelNameFromQuery = this.$route.query.model || null

    // 3. Populate the filters object based on the query
    if (makeNameFromQuery) {
      const makeObject = (this.makes || []).find(
        (m) => (m.name || '').toLowerCase() === String(makeNameFromQuery).toLowerCase(),
      )
      if (makeObject) {
        this.filters.makes = [makeObject.id] // Push the ID into the array
        // Fetch models for this make so we can resolve the model name (if present in the URL)
        await this.carDataStore.fetchModels(makeObject.id)
      }
    }

    if (modelNameFromQuery) {
      const modelList = this.availableModels || this.carDataStore.models || []
      const modelObject = modelList.find(
        (m) => (m.name || '').toLowerCase() === String(modelNameFromQuery).toLowerCase(),
      )
      if (modelObject) {
        this.filters.models = [modelObject.id] // Push the ID into the array
      }
    }

    // 4. Trigger the initial fetch with the populated filters
    // This ensures the page loads with the correct, filtered data
    this.applyAndFetch()
  },

  watch: {
    // Watch for changes in sortBy and re-fetch
    sortBy() {
      this.applyAndFetch()
    },

    // Watch for any changes in the filters object and re-fetch
    filters: {
      deep: true,
      handler() {
        this.applyAndFetch()
      },
    },

    // When the selected make changes, fetch the corresponding models
    'filters.makes'(newMakes, oldMakes) {
      // Check if the array content has actually changed to avoid unnecessary runs
      const hasChanged = JSON.stringify(newMakes) !== JSON.stringify(oldMakes)
      if (!hasChanged) return

      // Reset the model filter whenever the make changes
      // This check prevents resetting models if the change came from the URL on load
      if (oldMakes && oldMakes.length > 0) {
        this.filters.models = []
      }

      const firstMakeId = newMakes.length > 0 ? newMakes[0] : null
      if (firstMakeId) {
        this.carDataStore.fetchModels(firstMakeId)
      } else {
        // Clear models if no make is selected
        this.carDataStore.models = []
      }
    },
  },
}
</script>
