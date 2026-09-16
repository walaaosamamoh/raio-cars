<template>
  <div v-if="isOpen" class="fixed inset-0 z-50">
    <!-- Background -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50"
      @click="closeDrawer"
    ></div>

    <!-- Content -->
    <div
      class="fixed top-0 rtl:right-0 ltr:left-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 shadow-lg"
    >
      <div class="h-full overflow-y-auto p-4">
        <button
          @click="closeDrawer"
          class="text-xl text-gray-800 dark:text-gray-200"
        >
          ✕
        </button>

        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MobileFilterDrawer",

  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    isOpen(value) {
      document.body.style.overflow = value ? "hidden" : "";
    }
  },

  beforeUnmount() {
    document.body.style.overflow = "";
  },

  methods: {
    closeDrawer() {
      this.$emit("close");
    }
  }
};
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
