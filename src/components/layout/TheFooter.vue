<template>
  <footer class="bg-gray-900 dark:bg-gray-800 text-gray-300 py-10 px-6">
    <div class="container mx-auto px-4">
      <div
        class="grid grid-cols-1 text-center sm:text-start sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
      >
        <!-- Quick Links -->
        <div>
          <h2 class="text-lg md:text-xl font-bold mb-4 text-white">{{ $t('footer.quickLinks')}}</h2>
          <div class="flex flex-col space-y-2">
            <a href="#" class="hover:text-primary transition-colors">{{ $t('footer.aboutUs') }}</a>
            <a href="#" class="hover:text-primary transition-colors">{{
              $t('footer.privacyPolicy')
            }}</a>
            <a href="#" class="hover:text-primary transition-colors">{{
              $t('footer.termsOfService')
            }}</a>
            <a href="#" class="hover:text-primary transition-colors">{{
              $t('footer.contactUs')
            }}</a>
          </div>
        </div>

        <!-- States -->
        <div>
          <h2 class="text-lg md:text-xl font-bold mb-4 text-white">{{$t('states.states')}}</h2>
          <div
            v-for="state in states"
            class="flex flex-col space-y-2">
            <span>{{ state.name }}</span>
          </div>
        </div>

        <div>
          <h2 class="text-lg md:text-xl font-bold mb-4 text-white">{{$t('common.languages')}}</h2>
          <div class="flex justify-center sm:justify-start gap-2">
            <button
              @click="switchLanguage('en')"
              :class="[
                'rounded-full px-3 py-1 text-sm font-semibold transition-colors duration-300',
                $i18n.locale === 'en'
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300',
              ]"
            >
              English
            </button>
            <button
              @click="switchLanguage('ar')"
              :class="[
                'rounded-full px-3 py-1 text-sm font-semibold transition-colors duration-300',
                $i18n.locale === 'ar'
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300',
              ]"
            >
              العربية
            </button>
          </div>
        </div>

        <!-- Follow Us -->
        <div>
          <h2 class="text-lg md:text-xl font-bold mb-4 text-white">{{$t('footer.followUs')}}</h2>
          <!-- space-x-reverse automatically handles RTL direction for spacing -->
          <div class="flex items-center justify-center sm:justify-start gap-4">
            <a href="#" class="hover:text-primary transition-colors">
              <font-awesome-icon :icon="['fab', 'facebook']" class="h-5 w-5" />
            </a>
            <a href="#" class="hover:text-primary transition-colors">
              <font-awesome-icon :icon="['fab', 'twitter']" class="h-5 w-5" />
            </a>
            <a href="#" class="hover:text-primary transition-colors">
              <font-awesome-icon :icon="['fab', 'instagram']" class="h-5 w-5" />
            </a>
          </div>
        </div>

        <!-- Download App Section -->
        <div>
          <h2 class="text-lg md:text-xl font-bold mb-2 text-white">{{$t('footer.downloadApp')}}</h2>
          <div class="flex flex-col items-center sm:items-start">
            <!-- Google Play Button -->
            <a href="#" target="_blank" class="transition hover:opacity-80">
              <img
                src="/images/googleplay-badge-01.webp"
                alt="Get it on Google Play"
                class="h-16 w-auto"
              />
            </a>

            <!-- App Store Button -->
            <a href="#" target="_blank" class="transition hover:opacity-80">
              <img
                src="/images/download-on-the-app-store.svg"
                alt="Download on the App Store"
                class="h-8 w-auto"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright Section -->
      <div class="text-center sm:flex sm:items-center sm:gap-4 sm:text-start mt-10 pt-6 border-t border-gray-700">
        <img src="/images/logo_f.jpeg" alt="logo" class="h-14 mb-2 inline-block"/>
        <p class="text-sm text-gray-400">{{$t('footer.copyrightText')}}</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useStatesStore } from '@/stores/states'
export default {
  name: 'TheFooter',
  computed: {
    ...mapState(useStatesStore, ['states', 'loading', 'error']),
  },
  methods: {
    ...mapActions(useStatesStore, ['fetchStates']),
    switchLanguage(lang) {
      // Update the i18n locale
      this.$i18n.locale = lang
      // Save the preference
      localStorage.setItem('language', lang)
      this.fetchStates()
      // Update the document direction
      if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl')
      } else {
        document.documentElement.setAttribute('dir', 'ltr')
      }
    },
  },
  mounted() {
    this.fetchStates()
  },
}
</script>
