<template>
  <header class="relative bg-white dark:bg-gray-800 text-black dark:text-white shadow-md">
    <!-- Main Header Bar -->
    <div class="flex items-center justify-between gap-2 p-4 md:p-6">
      <!-- Left Side: Menu Button for Mobile -->
      <div>
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-full flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle sidebar"
        >
          <font-awesome-icon
            icon="bars"
            class="h-4 w-4 text-gray-600 dark:text-gray-400"
          ></font-awesome-icon>
        </button>
      </div>

      <!-- Right Side: Icons -->
      <div class="flex items-center gap-3">
        <!-- Theme Toggler -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-full flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
        >
          <font-awesome-icon
            v-if="theme === 'light'"
            icon="moon"
            class="h-4 w-4 text-gray-600 dark:text-gray-400"
          />
          <font-awesome-icon
            v-else
            icon="sun"
            class="h-4 w-4 text-yellow-500 dark:text-yellow-400"
          />
        </button>

        <!-- Notifications -->
        <button
          class="p-2 rounded-full flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          aria-label="Notifications"
        >
          <font-awesome-icon icon="bell" class="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <!-- Badge -->
          <span class="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- Language Selector (Desktop only) -->
        <div class="hidden md:flex relative items-center text-sm font-medium">
          <font-awesome-icon
            icon="globe"
            class="text-red-600 dark:text-red-500 absolute start-3 z-10 pointer-events-none"
          />
          <select
            @change="changeLanguage"
            :value="$i18n.locale"
            class="appearance-none outline-none rounded-md bg-white dark:bg-gray-900 w-full ps-9 pe-8 py-2"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-gray-300"
          >
            <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9.032l-6 6-6-6z" />
            </svg>
          </div>
        </div>

        <!-- Language Icon (Mobile only) -->
        <button
          @click="toggleLanguage"
          class="p-2 rounded-full flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
          aria-label="Change language"
        >
          <font-awesome-icon icon="globe" class="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>

        <!-- Profile Dropdown -->
        <div class="relative" @click.stop="isProfileOpen = !isProfileOpen" ref="profileButton">
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
              class="absolute ltr:right-0 rtl:left-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded"
            >
              <!-- visit website -->
              <router-link
                :to="{ name: 'home' }"
                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <font-awesome-icon icon="home" class="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span class="text-sm">
                  {{ $t('seller.visit_website') }}
                </span>
              </router-link>
              <!-- edit profile -->
              <router-link
                :to="{ name: 'profile' }"
                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <font-awesome-icon
                  icon="user-edit"
                  class="h-4 w-4 text-gray-600 dark:text-gray-400"
                />
                <span class="text-sm">
                  {{ $t('seller.edit_profile') }}
                </span>
              </router-link>
              <!-- logout -->
              <router-link
                :to="{ name: 'home' }"
                @click="logout"
                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                <font-awesome-icon
                  icon="sign-out-alt"
                  class="h-4 w-4 text-gray-600 dark:text-gray-400"
                />
                <span class="text-sm">
                  {{ $t('seller.logout') }}
                </span>
              </router-link>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'TheHeader',
  emits: ['toggle-sidebar'],
  data() {
    return {
      isProfileOpen: false,
    }
  },
  computed: {
    ...mapState(useThemeStore, ['theme']),
    ...mapState(useAuthStore, ['advertiser']),
  },
  methods: {
    ...mapActions(useThemeStore, ['toggleTheme', 'applyInitialTheme']),
    ...mapActions(useAuthStore, ['logout']),

    toggleLanguage() {
      const newLang = this.$i18n.locale === 'en' ? 'ar' : 'en'
      this.$i18n.locale = newLang
      localStorage.setItem('language', newLang)

      if (newLang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl')
      } else {
        document.documentElement.setAttribute('dir', 'ltr')
      }
    },

    // function to handle language change
    changeLanguage(event) {
      const selectedLang = event.target.value
      this.$i18n.locale = selectedLang
      localStorage.setItem('language', selectedLang)
      if (selectedLang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl')
      } else {
        document.documentElement.setAttribute('dir', 'ltr')
      }
    },
    applyInitialLanguage() {
      const savedLang = localStorage.getItem('language') || 'en'
      this.$i18n.locale = savedLang
      if (savedLang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl')
      } else {
        document.documentElement.setAttribute('dir', 'ltr')
      }
    },
    handleClickOutside(event) {
      const menu = this.$refs.profileMenu
      const btn = this.$refs.profileButton

      if (!this.isProfileOpen) return

      if (menu && !menu.contains(event.target) && btn && !btn.contains(event.target)) {
        this.isProfileOpen = false
      }
    },
  },
  mounted() {
    this.applyInitialTheme()
    this.applyInitialLanguage()

    // add listener
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    // remove listener
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>
