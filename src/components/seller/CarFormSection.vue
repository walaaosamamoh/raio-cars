<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <h2 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
      {{ title }}
    </h2>

    <div :class="gridClass">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarFormSection',
  props: {
    title: {
      type: String,
      required: true
    },
    gridClass: {
      type: String,
      default: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }
}
</script>
