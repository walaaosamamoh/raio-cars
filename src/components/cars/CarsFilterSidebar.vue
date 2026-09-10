<template>
  <aside class="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg h-fit border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-2">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">{{$t('carsView.filters')}}</h2>
      <button
        @click="resetFilter"
        class="text-sm font-medium text-primary dark:text-primary-dark hover:underline"
      >
        {{$t('carsView.reset')}}
      </button>
    </div>

    <div
      v-for="section in filterSections"
      :key="section.key"
      class="py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    >
      <button
        @click="toggleSection(section.key)"
        class="flex justify-between items-center w-full py-2 font-semibold text-gray-700 dark:text-gray-200"
      >
        <div class="flex items-center gap-3">
          <font-awesome-icon :icon="section.icon" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <span>{{ section.label }}</span>
        </div>
        <font-awesome-icon
          icon="chevron-down"
          class="w-3 h-3 transition-transform duration-300"
          :class="{ 'rotate-180': openSections.includes(section.key) }"
        />
      </button>

      <div v-show="openSections.includes(section.key)" class="pt-2 ps-4">
        <!-- Years Filter -->
        <div v-if="section.key === 'years'" class="flex gap-2 mb-2">
          <select v-model.number="localFilters.yearFrom" class="custom-select">
            <option :value="null">{{$t('carsView.from')}}</option>
            <option
              v-for="year in yearOptions"
              :key="'from-' + year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>
          <select v-model.number="localFilters.yearTo" class="custom-select">
            <option :value="null">{{$t('carsView.to')}}</option>
            <option
              v-for="year in yearOptions"
              :key="'to-' + year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Price Filter -->
        <div v-else-if="section.key === 'price'" class="flex items-center gap-2">
          <input
            type="number"
            v-model.number="localFilters.priceFrom"
            class="custom-input"
            :placeholder="minPrice.toLocaleString()"
            :min="minPrice"
          />
          <span class="text-gray-400">-</span>
          <input
            type="number"
            v-model.number="localFilters.priceTo"
            class="custom-input"
            :placeholder="maxPrice.toLocaleString()"
            :max="maxPrice"
          />
        </div>

        <!-- Checkbox Filters -->
        <div v-else class="space-y-2 max-h-60 overflow-y-auto">
          <!-- Makes -->
          <template v-if="section.key === 'makes'">
            <div
              v-for="make in makes"
              :key="make.id"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="`make-${make.id}`"
                :value="make.id"
                v-model="localFilters.makes"
                class="custom-checkbox"
              />
              <label
                :for="`make-${make.id}`"
                class="text-gray-600 dark:text-gray-300 ms-2 cursor-pointer text-sm"
              >
                {{ make.name }}
              </label>
            </div>
          </template>

          <!-- Models -->
          <template v-else-if="section.key === 'models'">
            <div v-if="localFilters.makes.length === 0" class="text-sm text-gray-500 text-center py-2">
              {{$t('carsView.selectMakeFirst')}}
            </div>
            <div
              v-else
              v-for="model in models"
              :key="model.id"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="`model-${model.id}`"
                :value="model.id"
                v-model="localFilters.models"
                class="custom-checkbox"
              />
              <label
                :for="`model-${model.id}`"
                class="text-gray-600 dark:text-gray-300 ms-2 cursor-pointer text-sm"
              >
                {{ model.name }}
              </label>
            </div>
          </template>

          <!-- States -->
          <template v-else-if="section.key === 'state'">
            <div
              v-for="state in states"
              :key="state.id"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="`state-${state.id}`"
                :value="state.name"
                v-model="localFilters.state"
                class="custom-checkbox"
              />
              <label
                :for="`state-${state.id}`"
                class="text-gray-600 dark:text-gray-300 ms-2 cursor-pointer text-sm"
              >
                {{ state.name }}
              </label>
            </div>
          </template>

          <!-- Cities -->
          <template v-else-if="section.key === 'city'">
            <div v-if="localFilters.state.length === 0" class="text-sm text-gray-500 text-center py-2">
              {{$t('carsView.selectStateFirst')}}
            </div>
            <div
              v-else
              v-for="city in cities"
              :key="city.id"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="`city-${city.id}`"
                :value="city.name"
                v-model="localFilters.city"
                class="custom-checkbox"
              />
              <label
                :for="`city-${city.id}`"
                class="text-gray-600 dark:text-gray-300 ms-2 cursor-pointer text-sm"
              >
                {{ city.name }}
              </label>
            </div>
          </template>

          <!-- Dynamic Options -->
          <template v-else>
            <div
              v-for="option in getOptions(section.key)"
              :key="option.id"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="`${section.key}-${option.id}`"
                :value="option.name"
                v-model="localFilters[section.key]"
                class="custom-checkbox"
              />
              <label
                :for="`${section.key}-${option.id}`"
                class="text-gray-600 dark:text-gray-300 ms-2 cursor-pointer text-sm"
              >
                {{ option.name }}
              </label>
            </div>
          </template>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { useCarDataStore } from '@/stores/carDataStore'
import { useStatesStore } from '@/stores/states'
import { mapState } from 'pinia'

export default {
  name: 'CarsFilterSidebar',
  props: {
    makes: Array,
    models: Array,
    filters: Object,
    minPrice: Number,
    maxPrice: Number,
  },
  data() {
    return {
      localFilters: { ...this.filters },
      openSections: ['makes'],
      filterSections: [
        { key: 'makes', label: this.$t('carsView.make'), icon: 'car' },
        { key: 'models', label: this.$t('carsView.model'), icon: 'car-side' },
        { key: 'years', label: this.$t('carsView.year'), icon: 'calendar-alt' },
        { key: 'price', label: this.$t('carsView.price'), icon: 'dollar-sign' },
        { key: 'transmission', label: this.$t('carsView.transmission'), icon: 'cogs' },
        { key: 'driveLine', label: this.$t('carsView.driveLine'), icon: 'road' },
        { key: 'fuel', label: this.$t('carsView.fuelType'), icon: 'gas-pump' },
        { key: 'cylinders', label: this.$t('carsView.cylinders'), icon: 'microchip' },
        { key: 'exterior', label: this.$t('carsView.exteriorColor'), icon: 'palette' },
        { key: 'interior', label: this.$t('carsView.interiorColor'), icon: 'palette' },
        { key: 'state', label: this.$t('carsView.state'), icon: 'map-marker-alt' },
        { key: 'city', label: this.$t('carsView.city'), icon: 'city' },
      ],
    }
  },

  computed: {
    ...mapState(useCarDataStore, [
      'transmissions',
      'drivetrains',
      'fuelTypes',
      'cylinders',
      'colors'
    ]),
    ...mapState(useStatesStore, [
      'states',
      'cities'
    ]),

    yearOptions() {
      const currentYear = new Date().getFullYear()
      const startYear = 1990
      return Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => currentYear - i
      )
    },
  },

  methods: {
    toggleSection(key) {
      const index = this.openSections.indexOf(key)
      if (index > -1) {
        this.openSections.splice(index, 1)
      } else {
        this.openSections.push(key)
      }
    },

    getOptions(key) {
      const optionsMap = {
        transmission: this.transmissions,
        driveLine: this.drivetrains,
        fuel: this.fuelTypes,
        cylinders: this.cylinders,
        exterior: this.colors,
        interior: this.colors,
        state: this.states,
        city: this.cities,
        years: this.yearOptions,
      }
      return optionsMap[key] || []
    },

    resetFilter() {
      this.localFilters = {
        makes: [],
        models: [],
        yearFrom: null,
        yearTo: null,
        priceFrom: null,
        priceTo: null,
        transmission: [],
        driveLine: [],
        fuel: [],
        cylinders: [],
        exterior: [],
        interior: [],
        state: [],
        city: [],
      }
    },
  },

  watch: {
    // Watch for changes in parent filters prop to sync localFilters
    filters: {
      handler(newParentFilters) {
        this.localFilters = {...newParentFilters}
      },
      deep: true,
    },

    // Emit updates to parent when localFilters change
    localFilters: {
      handler(val) {
        this.$emit('update-filters', val)
      },
      deep: true,
    },

    'localFilters.makes': {
      handler(newMakes) {
        // Reset models when makes change
        if (newMakes.length === 0) {
          this.localFilters.models = []
        }
      }
    },

    'localFilters.state': {
      handler(newStates) {
        const statesStore = useStatesStore()

        // Reset cities when state changes
        if (newStates.length === 0) {
          this.localFilters.city = []
        } else {
          // Fetch cities for the first selected state
          const firstStateName = newStates[0]
          const selectedState = this.states.find(s => s.name === firstStateName)
          if (selectedState) {
            statesStore.fetchCities(selectedState.id)
          }
        }
      }
    }
  },

  async created() {
    const statesStore = useStatesStore()
    const carDataStore = useCarDataStore()

    // Fetch initial data
    await Promise.all([
      statesStore.fetchStates(),
      carDataStore.fetchCarData()
    ])
  },
}
</script>

<style scoped lang="postcss">
.custom-select,
.custom-input {
  @apply w-full p-1 border border-gray-300 rounded-md bg-gray-50 outline-none transition-colors duration-300
  focus:border-primary focus:ring-1 focus:ring-primary
  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400;
}

.custom-checkbox {
  @apply h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary
  dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-dark dark:checked:bg-primary-dark;
}
</style>
