<template>
  <!-- Mobile Overlay -->
  <div
    v-if="isMobileOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    @click="$emit('close-sidebar')"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'aside bg-white dark:bg-gray-800 border-e-4 dark:border-gray-700 border-gray-200 shadow-xl transition-all duration-300 ease-in-out flex flex-col',
      'fixed lg:sticky top-0 z-50',
      isCollapsed ? 'w-20' : 'w-64',
      isMobileOpen
        ? 'translate-x-0'
        : $i18n.locale === 'ar'
          ? 'translate-x-full lg:translate-x-0'
          : '-translate-x-full lg:translate-x-0',
      $i18n.locale === 'ar' ? 'right-0' : 'left-0',
    ]"
    style="height: 100dvh"
  >
    <!-- Logo Section -->
    <div class="p-5 border-b dark:border-gray-700 flex items-center justify-between">
      <div class="overflow-hidden flex-1 flex justify-center items-center" v-if="!isCollapsed">
        <img :src="theme==='dark' ? '/images/logo_dark.jpeg' : '/images/logo.jpeg'" alt="Logo" class="w-18 h-14 object-contain" />
      </div>

      <!-- Collapse Button -->
      <button
        @click="toggleCollapse"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <font-awesome-icon
          :icon="
            isCollapsed
              ? $i18n.locale === 'en'
                ? 'chevron-right'
                : 'chevron-left'
              : $i18n.locale === 'en'
                ? 'chevron-left'
                : 'chevron-right'
          "
          class="text-gray-600 dark:text-gray-300"
        />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        @click="isMobileOpen = false"
        :title="isCollapsed ? $t(item.label) : ''"
        :class="[
          'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative',
          'hover:bg-primary/10 hover:text-primary dark:hover:text-primary-dark dark:hover:bg-primary-dark/20',
          $route.name === item.routeName
            ? 'dark:bg-primary-dark/20 dark:text-primary-dark bg-primary/20 text-primary font-semibold shadow-sm'
            : 'text-gray-600 dark:text-gray-300',
        ]"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          <font-awesome-icon
            :icon="item.icon"
            class="text-lg transition-transform group-hover:scale-110"
          />
        </div>

        <!-- Text (hidden when collapsed) -->
        <span
          class="whitespace-nowrap transition-opacity duration-200"
          :class="
            isCollapsed
              ? 'opacity-0 absolute left-full ml-2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg border dark:border-gray-600 z-10'
              : 'opacity-100'
          "
        >
          {{ $t(item.label) }}
        </span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t dark:border-gray-700">
      <div class="flex items-center justify-center" :class="isCollapsed ? 'justify-center' : ''">
        <div class="overflow-hidden transition-all duration-200" v-if="!isCollapsed">
          <p class="text-sm text-gray-600 dark:text-white truncate">{{$t('dashboard.powered_by')}}</p>
        </div>
        <img
          src="/images/etoo play.png"
          alt="Etoo Play"
          class="w-18 h-14 object-contain"
        />       
      </div>
    </div>

    <!-- Mobile Menu Button (shown only on mobile) -->
    <button
      @click="$emit('close-sidebar')"
      class="lg:hidden p-4 border-t dark:border-gray-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
    >
      <font-awesome-icon icon="times" class="mr-2" />
      <span>{{ $t('seller.close-menu') }}</span>
    </button>
  </aside>
</template>

<script>
import { mapState } from 'pinia'
import { useThemeStore } from '@/stores/theme'
export default {
  name: 'SellerSidebar',
  props: {
    isMobileOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isCollapsed: false,
      navItems: [
        {
          name: 'Dashboard',
          to: { name: 'dashboard' },
          routeName: 'dashboard',
          icon: 'chart-line',
          label: 'seller.dashboard',
          notification: 3,
        },
        {
          name: 'My Ads',
          to: { name: 'ads' },
          routeName: 'ads',
          icon: 'bullhorn',
          label: 'seller.ads',
          notification: 12,
        },
        {
          name: 'Plans',
          to: { name: 'plans' },
          routeName: 'plans',
          icon: 'gem',
          label: 'seller.plans',
        },
        {
          name: 'Account Verification',
          to: { name: 'accountVerification' },
          routeName: 'accountVerification',
          icon: 'user-check',
          label: 'seller.verification',
        },
      ],
    }
  },
  computed: {
    ...mapState(useThemeStore, ['theme']),
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
  },
  watch: {
    // Close mobile menu when route changes
    $route() {
      this.$emit("update:isMobileOpen", false)
    },
    // stop transition when change language
    '$i18n.locale'(){
      document.querySelector('.aside').style.transition = 'none'
      setTimeout(() => {
        document.querySelector('.aside').style.transition = 'transform 0.3s ease-in-out'
      }, 100);
    }
  
  },
  emits: ['close-sidebar', 'toggle-collapse','update:isMobileOpen'],
}
</script>

<style scoped>
/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.dark nav::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark nav::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* Smooth transitions */
aside {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;
}
</style>
