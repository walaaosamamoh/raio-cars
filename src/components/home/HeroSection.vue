<template>
  <!-- hero img with welcoming sentence and search bar -->
  <section
    class="relative h-[400px] md:h-[500px] flex flex-col justify-center items-center text-center px-4"
  >
    <!-- background img -->
    <img
      src="/src/assets/default/hero-image.jpg"
      alt="Hero Background"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />
    <div class="absolute inset-0 bg-black opacity-50 z-10"></div>

    <!-- welcoming sentence -->
    <div class="relative z-20 w-full flex flex-col items-center">
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        {{ $t('home.welcomeMessage') }}
      </h1>
      <p class="text-white mb-6 lg:text-xl">
        {{ $t('home.subMessage') }}
      </p>
      <!-- search section -->
      <div class="w-full max-w-2xl mx-auto relative" ref="searchContainer">
        <!-- search bar -->
        <div class="flex z-20">
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('home.searchPlaceholder')"
            @input="updateSearchResults"
            @focus="updateSearchResults"
            class="w-full px-4 py-2 ltr:rounded-l-md rtl:rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-dark"
          />
          <button
            class="px-4 py-2 bg-primary text-white ltr:rounded-r-md rtl:rounded-l-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark"
          >
            <!-- search icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <div
          v-if="searchResults.length > 0"
          class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-30 max-h-72 overflow-y-auto"
        >
          <ul>
            <li
              v-for="car in searchResults"
              :key="car.id"
              @click="selectCar(car)"
              class="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 dark:border-gray-700"
            >
              <img
                :src="car.photos[0] || '/images/placeholder.png'"
                :alt="car.name"
                class="h-10 w-16 object-cover rounded-md ltr:mr-4 rtl:ml-4"
              />
              <span class="font-semibold text-gray-800 dark:text-gray-200"
                >{{ car.name }} </span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {useAdsStore} from '@/stores/ads'
export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      adsStore: useAdsStore(),
    }
  },
  methods: {
    updateSearchResults() {
      if (this.searchQuery.trim() === '') {
        this.searchResults = []
        return
      }

      const query = this.searchQuery.toLowerCase()
      // fetch ads matching the query
      this.adsStore.fetchAds({name: query})
      this.searchResults = this.adsStore.ads
    },

    selectCar(car) {
      this.searchQuery = ''
      this.searchResults = []
      this.$router.push({
        name: 'cars',
        query: {
          make: car.make_id,
          model: car.model_id,
        },
      })
    },

    handleClickOutside(event){
      if(this.$refs.searchContainer && !this.$refs.searchContainer.contains(event.target)){
        this.searchResults =[];
      }
    }
  },
  mounted(){
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount(){
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>
