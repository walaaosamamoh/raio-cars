<template>
  <div
    class="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <!-- Title -->
    <h2
      class="text-2xl font-bold mb-6 text-gray-800 dark:text-white"
    >
      {{ $t('carDetails.information') }}
    </h2>

    <!-- Details Grid -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"
    >
      <div
        v-for="detail in details"
        :key="detail.key"
        class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-3"
      >
        <!-- Label + Icon -->
        <div
          class="flex items-center gap-3 min-w-0"
        >
          <font-awesome-icon
            :icon="getIconForKey(detail.key)"
            class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0"
          />

          <span
            class="text-gray-600 dark:text-gray-400"
          >
            {{ detail.label }}
          </span>
        </div>

        <!-- Value -->
        <span
          class="font-semibold text-gray-800 dark:text-white text-end ml-4"
        >
          {{ detail.value || '-' }}
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
      type: Array,
      required: true,
    },
  },

  methods: {
    /*
     * Return the appropriate Font Awesome icon
     * based on the stable detail key.
     *
     * We intentionally use the key instead of
     * the translated label.
     *
     * This means icons continue to work in both
     * English and Arabic.
     */
    getIconForKey(key) {
      const iconMap = {
        odometer: 'tachometer-alt',
        cylinders: 'cogs',
        transmission: 'cogs',
        keys: 'key',
        option: 'star',
        fuelType: 'gas-pump',
        driveLine: 'car-side',
        exteriorColor: 'palette',
        interiorColor: 'palette',
        region: 'map-marker-alt',
      }

      return (
        iconMap[key] ||
        'info-circle'
      )
    },
  },
}
</script>
