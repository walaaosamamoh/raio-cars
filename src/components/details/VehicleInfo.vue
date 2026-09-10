<template>
  <!-- Main container with improved styling to match the site's design system -->
  <div
    class="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      {{ $t('carDetails.information') }}
    </h2>

    <!-- Using a more robust grid layout -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
      <!-- Loop through each detail item -->
      <div
        v-for="(value, key) in details"
        :key="key"
        class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-3"
      >
        <!-- Left side: Icon and Key -->
        <div class="flex items-center gap-3">
          <font-awesome-icon
            :icon="getIconForKey(key)"
            class="w-5 h-5 text-gray-400 dark:text-gray-500"
          />
          <span class="text-gray-600 dark:text-gray-400">{{ $t(key) }}</span>
        </div>

        <!-- Right side: Value -->
        <span class="font-semibold text-gray-800 dark:text-white text-end">
          {{ value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VehicleInfo',
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  methods: {
    /**
     * Returns a specific Font Awesome icon based on the detail key.
     * This makes the UI much more scannable and visually appealing.
     * @param {string} key - The detail key (e.g., 'Odometer', 'Cylinders').
     * @returns {string} - The Font Awesome icon name.
     */
    getIconForKey(key) {
      const iconMap = {
        'carDetails.odometer': 'tachometer-alt',
        'carDetails.cylinders': 'cogs',
        'carDetails.transmission': 'cogs',
        'carDetails.key': 'key',
        'carDetails.options': 'star',
        'carDetails.fuelType': 'gas-pump',
        'carDetails.driveLine': 'car-side',
        'carDetails.exteriorColor': 'palette',
        'carDetails.interiorColor': 'palette',
        'carDetails.region': 'map-marker-alt',
      }
      // Return the specific icon or a default one
      return iconMap[key] || 'info-circle'
    },
  },
}
</script>
