<template>
    <!-- Main card container.  -->
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg h-full transition overflow-hidden">

    <!-- Image Section -->
    <div class="relative">
      <img :src="getPhoto" :alt="ad.name" class="w-full h-56 object-cover" />
    </div>

    <!-- Content Section -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white truncate">{{ ad.name }}</h3>

      <!-- Price and Time Section -->
      <div class="mt-2 flex justify-between items-center">
        <span class="font-bold text-primary dark:text-primary-dark text-lg md:text-xl">{{ formattedPrice }} SDG</span>
        <span class="text-gray-500 text-sm flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 me-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{{ timeAgo }}</span>
        </span>
      </div>

      <!-- Action Buttons Section -->
      <div class="flex mt-4 gap-3">
        <!-- WhatsApp Button -->
        <a
          :href="`https://wa.me/${this.ad.phone}`"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact via WhatsApp"
          class="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
        >
          <font-awesome-icon :icon="['fab', 'whatsapp']" class="h-5 w-5" />
        </a>

        <!-- Call Button -->
        <a
          :href="`tel:${this.ad.phone}`"
          aria-label="Call"
          class="flex-1 bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.1 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.13.87.38 1.7.73 2.46a2 2 0 0 1-.45 2.66L8.09 9.91a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.66-.45c.76.35 1.59.6 2.46.73A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CarCard",
  props: {
    ad: {
      type: Object,
      required: true,
    },
  },
  computed: {
    /**
     * Returns the first photo URL of the car ad.
     */
    getPhoto() {
      if (this.ad && this.ad.photos && this.ad.photos.length > 0) {
        return this.ad.photos[0];
      }
      return 'https://via.placeholder.com/400x300?text=No+Image';
    },
    /**
     * Formats the car price with commas for better readability.
     * e.g., 79999 becomes "79,999"
     */
    formattedPrice() {
      if (this.ad && this.ad.price) {
        return Number(this.ad.price).toLocaleString();
      }
      return 'N/A';
    },
    /**
     * Computes the "time ago" string.
     */
    timeAgo() {
      if (this.ad && this.ad.created_at) {
        return this.$dayjs(this.ad.created_at).fromNow();
      }
      return '';
    }
  }
};
</script>
