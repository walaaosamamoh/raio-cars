<template>
  <div :class="[$i18n.locale==='ar'?'rtl':'ltr', 'flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4']">
    <div
      class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {{ $t('sign_in.title') }}
        </h1>
        <p class="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
          {{ $t('sign_in.subtitle') }}
        </p>
      </div>

      <!-- Form -->
      <VForm class="space-y-7" @submit="handleSendOtp" :validation-schema="signInSchema">
        <!-- Phone Number Input -->
        <div>
          <label
            for="phone"
            class="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
            >{{ $t('sign_in.phone_label') }}</label
          >
          <div class="flex rounded-md shadow-sm">
            <!-- Custom Dropdown for Country Code -->
            <div class="relative" ref="countryDropdown">
              <button
                type="button"
                @click.stop="toggleDropdown"
                class="relative z-10 h-full inline-flex items-center px-3 py-2 border border-e-0 border-gray-300 bg-gray-50 rounded-s-md text-sm text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <span>{{ selectedCountry.flag }}</span>
                <svg class="ms-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>

              <!-- Dropdown Panel -->
              <div
                v-if="isDropdownOpen"
                class="absolute z-20 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <ul class="max-h-60 overflow-auto py-1">
                  <li
                    v-for="country in countries"
                    :key="country.code"
                    @click="selectCountry(country)"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <span class="me-3 text-lg">{{ country.flag }}</span>
                    <span>{{ country.name }} ({{ country.dial_code }})</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Phone Number Field with WhatsApp Icon -->
            <div class="relative flex-grow">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <font-awesome-icon :icon="['fab', 'whatsapp']" class="text-gray-400" />
              </div>
              <VField
                id="phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                class="custom-input w-full rounded-s-none rounded-md ps-10 rtl:pe-10"
                :placeholder="$t('sign_in.phone_placeholder')"
                :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
                :style="{ textAlign: $i18n.locale === 'ar' ? 'right' : 'left' }"
              />
            </div>
          </div>
          <div class="min-h-[24px]">
            <VErrorMessage name="phone" class="text-xs md:text-sm text-red-500 mt-1" />
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none transition-colors disabled:bg-gray-400"
        >
          <span v-if="!loading">{{ $t('sign_in.send_otp_button') }}</span>
          <span v-else>
            <!-- Loading spinner -->
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        </button>

        <!-- رسائل الخطأ من الـ API -->
        <div v-if="auth.error" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 me-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <p class="text-red-700 text-sm font-medium">{{ auth.error }}</p>
          </div>
        </div>

      </VForm>

      <!-- "Not a seller" link -->
      <div class="text-center mt-8">
        <p class="text-sm md:text-base text-gray-500 dark:text-gray-400">
          {{ $t('sign_in.not_a_seller') }}
          <router-link
            :to="{ name: 'home' }"
            class="font-medium text-primary dark:text-primary-dark hover:underline transition-colors"
          >
            {{ $t('sign_in.browse_cars') }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { signInSchema } from '@/schemas/validationSchemas'
import { useAuthStore } from '@/stores/auth'

const countries = [
  { name: 'Sudan', code: 'SD', dial_code: '249', flag: '🇸🇩' },
  { name: 'Saudi Arabia', code: 'SA', dial_code: '966', flag: '🇸🇦' },
  { name: 'Egypt', code: 'EG', dial_code: '20', flag: '🇪🇬' },
  { name: 'United Arab Emirates', code: 'AE', dial_code: '971', flag: '🇦🇪' },
];

export default {
  name: 'SignInView',
  data() {
    return {
      auth: useAuthStore(),
      signInSchema,
      loading: false,
      countries,
      selectedCountry: countries[0],
      isDropdownOpen: false,
    };
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.focusPhoneInput();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      // Use composedPath for shadow DOM / SVG compatibility
      const path = event.composedPath ? event.composedPath() : (event.path || []);
      const dropdownEl = this.$refs.countryDropdown;
      if (!dropdownEl) return;
      // If the click event path doesn't include the dropdown, close it
      if (!path.includes(dropdownEl)) {
        this.isDropdownOpen = false;
      }
    },

    // toggle using an explicit method and stop propagation on the button click
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

     focusPhoneInput() {
       this.$nextTick(() => {
         const phoneInput = document.getElementById('phone');
         if (phoneInput) phoneInput.focus();
       });
     },

     async handleSendOtp(values) {
       if (this.loading) return;

       this.loading = true;
       const fullPhoneNumber = this.selectedCountry.dial_code + values.phone;

       try {
         const success = await this.auth.sendOtp(fullPhoneNumber);

         if (success) {
           this.$toast.success(this.auth.message);
           this.$router.push({ name: 'verifyOtp', params: { phone: fullPhoneNumber } });
         }
       } catch {
         this.$toast.error('Network error occurred');
       } finally {
         this.loading = false;
       }
     },

     selectCountry(country) {
       this.selectedCountry = country;
       this.isDropdownOpen = false;
       this.focusPhoneInput();
     }
   }
 }
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
