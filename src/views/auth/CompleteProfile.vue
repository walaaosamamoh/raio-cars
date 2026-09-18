<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
    <div
      class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {{ $t('complete_profile.title') }}
        </h1>
        <p class="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
          {{ $t('complete_profile.subtitle') }}
        </p>
      </div>

      <!-- Form -->
      <VForm class="space-y-6" @submit="handleSubmit" :validation-schema="profileSchema">
        <!-- Profile Image Upload -->
        <div class="flex flex-col items-center">
          <label for="profileImage" class="cursor-pointer group">
            <div class="relative">
              <!-- Profile Image Preview -->
              <div
                class="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 hover:border-primary transition-colors"
              >
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  alt="Profile Preview"
                  class="w-full h-full object-cover"
                />
                <img
                  v-else
                  :src="defaultImage"
                  alt="Default Profile"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Edit Icon -->
              <div class="absolute bottom-0 right-0 bg-primary rounded-full p-2 text-white">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                </svg>
              </div>
            </div>

            <input
              id="profileImage"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
            />
          </label>

          <!-- Image Error Message -->
          <div class="min-h-[24px]">
            <span v-if="imageError" class="text-xs text-red-500 mt-2">
              {{ imageError }}
            </span>
          </div>
        </div>

        <!-- Name Input -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('complete_profile.name_label') }}
          </label>
          <VField
            id="name"
            name="name"
            type="text"
            v-model="name"
            :class="[
              'custom-input w-full rounded-md px-3',
              $i18n.locale === 'ar' ? 'text-right' : 'text-left',
            ]"
            :placeholder="$t('complete_profile.name_placeholder')"
            :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          />
          <div class="min-h-[24px]">
            <VErrorMessage name="name" class="text-xs text-red-500 mt-1" />
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="auth.loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none transition-colors disabled:bg-gray-400"
          >
            <span v-if="!auth.loading">{{ $t('complete_profile.submit_button') }}</span>
            <span v-else>
              <!-- Loading Spinner -->
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          </button>
        </div>

        <!-- Error Message من الـ store -->
        <div v-if="auth.error" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 me-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <p class="text-red-700 text-sm font-medium">{{ auth.error }}</p>
          </div>
        </div>
      </VForm>
    </div>
  </div>
</template>

<script>
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'CompleteProfileVueOptions',
  data() {
    return {
      auth: useAuthStore(),
      name: '',
      selectedFile: null,
      previewImage: null,
      imageError: '',
      defaultImage: '/src/assets/default/default-avatar.png',
      profileSchema: yup.object({
        name: yup
          .string()
          .required(this.$t('validation.name_required'))
          .min(2, this.$t('validation.name_min')),
      }),
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      // Revoke previous preview URL if exists
      if (this.previewImage) {
        URL.revokeObjectURL(this.previewImage)
      }

      this.imageError = ''
      this.selectedFile = file
      this.previewImage = URL.createObjectURL(file)
    },

    async loadDefaultImage() {
      const response = await fetch(this.defaultImage)
      const blob = await response.blob()
      return new File([blob], 'default-avatar.png', { type: blob.type })
    },

    async handleSubmit(values) {
      this.imageError = ''

      try {
        let fileToSend = this.selectedFile
        if (!fileToSend) {
          fileToSend = await this.loadDefaultImage()
        }

        const success = await this.auth.createAdvertiser(this.auth.phone, values.name, fileToSend)

        if (success) {
          this.$toast.success(this.auth.message || this.$t('complete_profile.profile_success'))
          this.$router.push({ name: 'dashboard' })
        } else {
          this.$toast.error(this.auth.error || this.$t('complete_profile.profile_failed'))
        }
      } catch (error) {
        console.error('Error creating profile:', error)
        this.$toast.error(this.$t('complete_profile.profile_error'))
      }
    },
  },
}
</script>
