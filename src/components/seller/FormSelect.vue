<template>
  <div class="relative w-full">
    <label :for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
    </label>

    <!-- Custom Select Wrapper -->
    <VField
      :id="name"
      :value="modelValue"
      as="select"
      :name="name"
      class="w-full appearance-none pr-8 pl-2 py-2 custom-input rounded-md border dark:text-gray-200 text-gray-700"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
      >
        {{ option.name }}
      </option>
    </VField>

    <!-- Custom Arrow -->
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
      <svg class="h-4 w-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>

    <div class="min-h-[24px] transition-all duration-200">
      <VErrorMessage :name="name" class="text-red-500 text-sm mt-1 block" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Select...'
    },
    options: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: false
    },
    optionKey: {
      type: String,
      default: ''
    },
    optionLabel: {
      type: String,
      default: ''
    }
  },
  
  emits: ['update:modelValue']
}
</script>
