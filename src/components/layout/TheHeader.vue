<template>
  <header class="relative bg-white dark:bg-gray-800 text-black dark:text-white shadow-md">
    <!-- Main Header Bar (Visible on all screen sizes) -->
    <div class="flex items-center justify-between gap-2 p-2 md:p-4">
      <div class="flex gap-2">
        <!-- Left Side: Logo -->
        <router-link :to="{ name: 'home' }" class="flex-shrink-0">
          <img class="h-14 md:h-16 w-auto" :src="theme==='dark' ? '/src/assets/default/logo_dark.jpeg' : '/src/assets/default/logo.jpeg'" alt="Logo" />
        </router-link>

        <!-- Center/Desktop-only items -->
        <div class="hidden md:flex items-center gap-4">
          <!-- Select State (Visible on Medium screens and up) -->
          <div class="relative">
            <select
              class="appearance-none outline-none border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm w-full px-3 pe-8 py-2"
              :disabled="loading"
            >
              <option v-if="loading" disabled value="">⏳ {{ $t('common.loading') }}</option>
              <option v-else-if="error" value="">{{ $t('common.error') }}</option>
              <template v-else>
                <option v-for="state in states" :key="state.id" :value="state.id">
                  {{ state.name }}
                </option>
              </template>
            </select>
            <div class="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9.032l-6 6-6-6z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Icons -->
      <div class="flex items-center gap-1">
        <!-- Sign In Button -->
        <router-link
          v-if="!isAuthenticated"
          :to="{ name: 'signIn' }"
          class="p-2 rounded-full flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Sign In"
        >
          <font-awesome-icon icon="arrow-right-to-bracket" class="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </router-link>

        <!-- Theme Toggler (Visible on all screens) -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-full flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
        >
          <font-awesome-icon v-if="theme === 'light'" icon="moon" class="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <font-awesome-icon v-else icon="sun" class="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
        </button>

        <!-- Language Selector (Visible on Medium screens and up) -->
        <div class="hidden md:flex relative items-center text-sm font-medium">
          <font-awesome-icon icon="globe" class="text-red-600 dark:text-red-500 absolute start-3 z-10 pointer-events-none" />
          <select
            @change="changeLanguage"
            :value="$i18n.locale"
            class="appearance-none outline-none rounded-md bg-white dark:bg-gray-900 w-full ps-9 pe-8 py-2"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9.032l-6 6-6-6z" />
            </svg>
          </div>
        </div>

        <!-- Profile Dropdown -->
        <div
          v-if="isAuthenticated"
          class="relative"
          @click.stop="isProfileOpen = !isProfileOpen"
          ref="profileButton"
        >
          <img
            v-if="advertiser"
            :src="advertiser.photo"
            class="w-8 h-8 rounded-full cursor-pointer"
            alt="Profile"
          />
          <transition name="fade">
            <div
              v-if="isProfileOpen"
              ref="profileMenu"
              class="absolute ltr:right-0 rtl:left-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded z-20"
            >
              <!-- return dashboard -->
              <router-link
                :to="{ name: 'dashboard' }"
                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <font-awesome-icon icon="home" class="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span class="text-sm">{{ $t('seller.dashboard') }}</span>
              </router-link>

              <!-- edit profile -->
              <router-link
                :to="{ name: 'profile' }"
                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <font-awesome-icon icon="user-edit" class="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span class="text-sm">{{ $t('seller.edit_profile') }}</span>
              </router-link>

              <!-- logout -->
              <router-link
                :to="{ name: 'home' }"
                @click="logout"
                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                <font-awesome-icon icon="sign-out-alt" class="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span class="text-sm">{{ $t('seller.logout') }}</span>
              </router-link>
            </div>
          </transition>
        </div>

        <!-- Hamburger Menu Button (Visible on Mobile only) -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="isMenuOpen"
      class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
    >
      <div class="p-4 space-y-4">
        <!-- Mobile: Select State -->
        <div class="relative">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('states.selectState') }}
          </label>
          <select
            class="mt-1 w-full appearance-none outline-none border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm px-3 pe-8 py-2"
            :disabled="loading"
          >
            <option v-if="loading" disabled value="">⏳ {{ $t('common.loading') }}</option>
            <option v-else-if="error" value="">{{ $t('common.error') }}</option>
            <template v-else>
              <option v-for="state in states" :key="state.id" :value="state.id">
                {{ state.name }}
              </option>
            </template>
          </select>
          <div class="pointer-events-none absolute bottom-3 end-2 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9.032l-6 6-6-6z" />
            </svg>
          </div>
        </div>

        <!-- Mobile: Language Selector -->
        <div class="relative">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('common.language') }}
          </label>
          <select
            @change="changeLanguage"
            :value="$i18n.locale"
            class="mt-1 w-full appearance-none outline-none border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 ps-3 pe-8 py-2"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <div class="pointer-events-none absolute bottom-3 end-2 flex items-center justify-center px-2 text-gray-700 dark:text-gray-300">
            <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9.032l-6 6-6-6z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useStatesStore } from '@/stores/states'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'TheHeader',

  data() {
    return {
      isMenuOpen: false,
      isProfileOpen: false,
    }
  },

  computed: {
    ...mapState(useThemeStore, ['theme']),
    ...mapState(useStatesStore, ['states', 'loading', 'error']),
    ...mapState(useAuthStore, ['isAuthenticated', 'advertiser']),
  },

  methods: {
    ...mapActions(useStatesStore, ['fetchStates']),
    ...mapActions(useThemeStore, ['toggleTheme', 'applyInitialTheme']),
    ...mapActions(useAuthStore, ['logout']),

    changeLanguage(event) {
      const selectedLang = event.target.value
      this.$i18n.locale = selectedLang
      localStorage.setItem('language', selectedLang)
      this.fetchStates()
      document.documentElement.setAttribute('dir', selectedLang === 'ar' ? 'rtl' : 'ltr')
      this.isMenuOpen = false
    },

    applyInitialLanguage() {
      const savedLang = localStorage.getItem('language') || 'en'
      this.$i18n.locale = savedLang
      document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr')
    },

    handleClickOutside(event) {
      const menu = this.$refs.profileMenu
      const btn = this.$refs.profileButton

      if (!this.isProfileOpen) return

      if (
        menu &&
        !menu.contains(event.target) &&
        btn &&
        !btn.contains(event.target)
      ) {
        this.isProfileOpen = false
      }
    },
  },

  mounted() {
    this.applyInitialTheme()
    this.applyInitialLanguage()
    this.fetchStates()

    // add listener
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    // remove listener
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>
