<template>
  <div class="profile-edit-page p-4 lg:p-6">
    <div class="max-w-6xl mx-auto space-y-10">

      <div class="mb-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('editProfile.edit_title') }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">{{ $t('editProfile.edit_subtitle') }}</p>
      </div>

      <!-- Form 1: Profile Information -->
      <VForm @submit="handleProfileUpdate" :validation-schema="profileSchema">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('editProfile.basic_info') }}</h2>
          
          <div class="flex items-center gap-4">
            <img :src="profileForm.avatarPreview || '/images/default-avatar.png'" class="w-16 h-16 rounded-full object-cover border-2 border-gray-300" />
            <div>
              <button type="button" @click="$refs.fileInput.click()" class="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark">
                {{ $t('editProfile.change_photo') }}
              </button>
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
            </div>
          </div>
          <p v-if="avatarError" class="text-red-500 text-sm mt-1">{{ avatarError }}</p>

          <FormInput v-model="profileForm.name" name="name" :label="$t('editProfile.name')" :placeholder="$t('editProfile.name_placeholder')" required class="mt-8" />
          <FormInput v-model="profileForm.about" name="about" :label="$t('editProfile.about')" :placeholder="$t('editProfile.about_placeholder')" />
        </div>

        <div class="flex gap-4 justify-end mt-6">
          <router-link to="/dashboard" class="px-6 py-2 border rounded-lg ...">{{ $t('editProfile.cancel') }}</router-link>
          <button type="submit" :disabled="profileLoading" class="px-6 py-2 bg-primary text-white rounded-lg ...">
            {{ profileLoading ? $t('editProfile.saving') : $t('editProfile.save_changes') }}
          </button>
        </div>
      </VForm>

      <!-- Form 2: Phone Number Change -->
      <VForm @submit="goToVerify" :validation-schema="phoneSchema">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('editProfile.phone_section_title') }}</h2>
          
          <FormInput v-model="phoneForm.current_phone" name="current_phone" :label="$t('editProfile.current_phone')" disabled class="opacity-60" />
          <FormInput v-model="phoneForm.new_phone" name="new_phone" :label="$t('editProfile.new_phone')" :placeholder="$t('editProfile.new_phone_placeholder')" type="tel" required />
          
          <div class="mt-6">
            <button type="submit" :disabled="phoneLoading" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
              {{ phoneLoading ? $t('editProfile.processing') : $t('editProfile.change_phone_and_verify') }}
            </button>
          </div>
        </div>
      </VForm>

    </div>
  </div>
</template>

<script>
import { object, string } from 'yup';
import FormInput from '@/components/seller/FormInput.vue';
import { toastService } from '@/services/toastService';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'ProfileEditPage',
  components: { FormInput },
  data() {
    return {
      profileLoading: false,
      phoneLoading: false,
      avatarError: '',
      
      profileForm: {
        name: '',
        about: '',
        avatarFile: null,
        avatarPreview: '',
      },
      
      phoneForm: {
        current_phone: '',
        new_phone: '',
      },
    };
  },
  computed: {
    profileSchema() {
      return object({
        name: string().required(this.$t('editProfile.name_required')),
        about: string().nullable(),
      });
    },

    phoneSchema() {
      return object({
        new_phone: string()
          .required(this.$t('editProfile.new_phone_required'))
          .notOneOf([this.phoneForm.current_phone], this.$t('editProfile.phone_must_be_different'))
          .matches(/^\+?[1-9]\d{1,14}$/, this.$t('editProfile.invalid_phone')),
      });
    },
  },
  methods: {
    async handleProfileUpdate(values) {
      this.profileLoading = true;
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('about', values.about || '');
        if (this.profileForm.avatarFile) {
          formData.append('photo', this.profileForm.avatarFile);
        }
        
        // TODO: Call store action to update profile
        console.log("Submitting profile data...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        toastService.success(this.$t('profile.update_success'));

      } catch (error) {
        toastService.error(this.$t('profile.update_error'));
      } finally {
        this.profileLoading = false;
      }
    },

    async goToVerify() {
      this.phoneLoading = true;
      try {
        const authStore = useAuthStore();
        const success = await authStore.sendOtp(this.phoneForm.new_phone);

        if (success) {
          this.$router.push({
            name: 'verifyOtp',
            query: {
              phone: this.phoneForm.new_phone,
              action: 'update-phone' // Inform OTP page about the context
            }
          });
        } else {
          toastService.error(authStore.error || this.$t('profile.send_code_error'));
        }
      } catch (error) {
        toastService.error(this.$t('profile.send_code_error'));
      } finally {
        this.phoneLoading = false;
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      this.avatarError = '';
      if (!file.type.startsWith('image/')) {
        this.avatarError = this.$t('profile.invalid_image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB size limit
        this.avatarError = this.$t('profile.image_too_large');
        return;
      }

      this.profileForm.avatarFile = file;
      this.profileForm.avatarPreview = URL.createObjectURL(file);
    },
  },
  created() {
    // Populate forms with current user data on component creation
    const authStore = useAuthStore();
    const currentUser = authStore.advertiser;
    
    if (currentUser) {
      this.profileForm.name = authStore.advertiserName;
      this.profileForm.about = currentUser.about || '';
      this.profileForm.avatarPreview = currentUser.photo || '';
      this.phoneForm.current_phone = authStore.phone || '';
    }
  },
  beforeUnmount() {
    // Clean up the blob URL to prevent memory leaks
    if (this.profileForm.avatarPreview && this.profileForm.avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(this.profileForm.avatarPreview);
    }
  }
}
</script>