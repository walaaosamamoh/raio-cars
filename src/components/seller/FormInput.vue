<template>
  <div>
    <label :for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
    </label>

    <VField
      :id="name"
      :value="modelValue"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :disabled="$attrs.disabled"
      :dir= "$i18n.locale==='ar'?'rtl':'ltr'"
      class="w-full custom-input px-2 rounded-md dark:text-gray-200 text-gray-700"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <div class="min-h-[24px] transition-all duration-200">
      <VErrorMessage :name="name" class="text-red-500 text-sm mt-1 block" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormInput',
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
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
}
</script>
