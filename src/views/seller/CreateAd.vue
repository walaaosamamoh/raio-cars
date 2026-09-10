<template>
  <div class="create-ad-page p-4 lg:p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('create_ad.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ $t('create_ad.subtitle') }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !formSubmitted" class="text-center py-12">
        <svg class="animate-spin h-8 w-8 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
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
        <p class="text-gray-600 dark:text-gray-400">{{ $t('create_ad.loading_data') }}</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="carStore.getError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
      >
        <p class="text-red-800 dark:text-red-200">{{ carStore.getError }}</p>
        <button
          @click="carStore.fetchCarData()"
          class="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          {{ $t('create_ad.retry') }}
        </button>
      </div>

      <!-- Form -->
      <VForm v-else @submit="handleSubmit" :validation-schema="formValidationSchema" class="space-y-6">
        <!-- Basic Information -->
        <CarFormSection :title="$t('create_ad.basic_info')">
          <FormSelect
            v-model="form.make"
            name="make"
            :label="$t('create_ad.make')"
            :placeholder="$t('create_ad.select_make')"
            :options="makesStore.makes"
            required
            @update:modelValue="onMakeChange"
          />
          <FormSelect
            v-model="form.model"
            name="model"
            :label="$t('create_ad.model')"
            :placeholder="$t('create_ad.select_model')"
            :options="carStore.models"
            :disabled="!form.make"
            required
          />
          <FormSelect
            v-model.number="form.year"
            name="year"
            :label="$t('create_ad.year')"
            :placeholder="$t('create_ad.select_year')"
            :options="carStore.years"
            required
          />
          <FormInput
            v-model.number="form.price"
            name="price"
            type="number"
            :label="$t('create_ad.price') + ' (SDG)'"
            :placeholder="$t('create_ad.price_placeholder')"
            required
          />
        </CarFormSection>

        <!-- Specifications -->
        <CarFormSection :title="$t('create_ad.specifications')">
          <FormSelect
            v-model="form.transmission"
            name="transmission"
            :label="$t('create_ad.transmission')"
            :placeholder="$t('create_ad.select_transmission')"
            :options="carStore.transmissions"
          />
          <FormSelect
            v-model="form.fuel_type"
            name="fuel_type"
            :label="$t('create_ad.fuel_type')"
            :placeholder="$t('create_ad.select_fuel')"
            :options="carStore.fuelTypes"
          />
          <FormSelect
            v-model="form.drive_line"
            name="drive_line"
            :label="$t('create_ad.drivetrains')"
            :placeholder="$t('create_ad.select_drivetrains')"
            :options="carStore.drivetrains"
          />
          <FormSelect
            v-model="form.cylinders"
            name="cylinders"
            :label="$t('create_ad.cylinder')"
            :placeholder="$t('create_ad.select_cylinder')"
            :options="carStore.cylinders"
          />
          <FormSelect
            v-model.number="form.odometer"
            name="odometer"
            :label="$t('create_ad.odometer') + ' (KM)'"
            :placeholder="$t('create_ad.select_odometer')"
            :options="carStore.odometers"
          />
          <FormSelect
            v-model="form.exterior_color"
            name="exterior_color"
            :label="$t('create_ad.exterior_color')"
            :placeholder="$t('create_ad.select_exterior_color')"
            :options="carStore.colors"
          />
          <FormSelect
            v-model="form.interior_color"
            name="interior_color"
            :label="$t('create_ad.interior_color')"
            :placeholder="$t('create_ad.select_interior_color')"
            :options="carStore.colors"
          />
          <FormSelect
            v-model="form.option"
            name="option"
            :label="$t('create_ad.option')"
            :placeholder="$t('create_ad.select_option')"
            :options="carStore.options"
          />
          <FormInput
            v-model.number="form.keys"
            name="keys"
            type="number"
            :label="$t('create_ad.key')"
            :placeholder="$t('create_ad.key_placeholder')"
          />
        </CarFormSection>

        <!-- Location & Contact -->
        <CarFormSection
          :title="$t('create_ad.location_contact')"
          grid-class="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormSelect
            v-model="form.state"
            name="state"
            :label="$t('create_ad.state')"
            :placeholder="$t('create_ad.select_state')"
            :options="stateStore.states"
            required
            @update:modelValue="onStateChange"
          />
          <FormSelect
            v-model="form.city"
            name="city"
            :label="$t('create_ad.city')"
            :placeholder="$t('create_ad.select_city')"
            :options="stateStore.cities"
            required
          />
          <FormInput
            v-model="form.phone"
            name="phone"
            type="tel"
            :label="$t('create_ad.phone')"
            :placeholder="$t('create_ad.phone_placeholder')"
            required
          />
          <FormInput
            v-model="form.whatsapp"
            name="whatsapp"
            type="tel"
            :label="$t('create_ad.whatsapp_number')"
            :placeholder="$t('create_ad.whatsapp_placeholder')"
            required
          />
        </CarFormSection>

        <!-- Description -->
        <CarFormSection :title="$t('create_ad.description')" grid-class="grid grid-cols-1 gap-6">
          <VField
            v-model="form.description"
            as="textarea"
            name="description"
            rows="6"
            class="w-full custom-input resize-none px-2"
            :placeholder="$t('create_ad.description_placeholder')"
          />
          <div class="min-h-[24px] transition-all duration-200">
            <VErrorMessage name="description" class="text-red-500 text-sm mt-1 block" />
          </div>
        </CarFormSection>

        <!-- Images -->
        <CarFormSection :title="$t('create_ad.images')" grid-class="grid grid-cols-1 gap-6">
          <ImageUploader
            v-model="form.imagesData"
            :required="true"
            :show-validation="formSubmitted"
            @validation="onImagesValidation"
            @upload-error="onUploadError"
          />
        </CarFormSection>

        <!-- Submit Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-end items-center">
          <router-link
            to="/dashboard"
            class="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
          >
            {{ $t('create_ad.cancel') }}
          </router-link>
          <button
            type="submit"
            :disabled="loading || carStore.loading"
            class="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">{{ $t('create_ad.publish') }}</span>
            <span v-else class="flex items-center gap-2 justify-center">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
      </VForm>
    </div>
  </div>
</template>
<script> 
import { useAdsStore } from '@/stores/ads'
import { useCarDataStore } from '@/stores/carDataStore'
import { useMakesStore } from '@/stores/makes'
import { useStatesStore } from '@/stores/states'
import { useAuthStore } from '@/stores/auth'
import { mapState } from 'pinia'

import CarFormSection from '@/components/seller/CarFormSection.vue'
import FormSelect from '@/components/seller/FormSelect.vue'
import FormInput from '@/components/seller/FormInput.vue'
import ImageUploader from '@/components/seller/ImageUploader.vue'
import { buildCreateAdSchema } from '@/schemas/createAdSchema'

export default {
  name: 'CreateAdPage',
  components: { CarFormSection, FormSelect, FormInput, ImageUploader },
  data() {
    return {
      loading: false, 
      formSubmitted: false,
      imagesValid: false,
      form: {
        make: '',
        model: '',
        year: null,
        price: null,
        fuel_type: '',
        transmission: '',
        drive_line: '',
        cylinders: '',
        exterior_color: '',
        odometer: '',
        interior_color: '',
        option: '',
        keys: '',
        state: '',
        city: '',
        phone: '',
        whatsapp: '',
        description: '',
        imagesData: {
          files: [],
          featured_file: null,
        },
      },
    }
  },
  computed: {
    ...mapState(useCarDataStore, { carStoreLoading: 'loading', getError: 'getError' }),
    adsStore() {
      return useAdsStore()
    },
    carStore() {
      return useCarDataStore()
    },
    makesStore() {
      return useMakesStore()
    },
    stateStore() {
      return useStatesStore()
    },
    authStore() {
      return useAuthStore()
    },
    formValidationSchema() {
      return buildCreateAdSchema(this.$t)
    },
  },
  async mounted() {
    await Promise.all([
      this.carStore.fetchCarData(),
      this.makesStore.fetchMakes(),
      this.stateStore.fetchStates(),
    ])
    this.generateYears()
  },
  methods: {
    generateYears() {
      const currentYear = new Date().getFullYear()
      this.carStore.years = Array.from({ length: currentYear - 1989 }, (_, i) => ({
        id: currentYear - i,
        name: (currentYear - i).toString(),
      }))
    },

    async onMakeChange(makeId) {
      if (!makeId) {
        this.carStore.models = []
        this.form.model = ''
        return
      }
      await this.carStore.fetchModels(makeId)
      this.form.model = ''
    },

    async onStateChange(stateId) {
      if (!stateId) {
        this.stateStore.cities = []
        this.form.city = ''
        return
      }
      await this.stateStore.fetchCities(stateId)
      this.form.city = ''
    },

    onImagesValidation(isValid) {
      this.imagesValid = !!isValid
    },
    
    onUploadError(error) {
      console.error('Image upload error received from child:', error)
    },

    async handleSubmit(values) {
      console.log('handleSubmit triggered...');
      this.formSubmitted = true; 

      // 1. validate images
      if (!this.imagesValid) {
        console.warn('Image validation failed. Aborting submission.');
        this.$toast?.error?.(this.$t('validation.images_required') || 'Please upload at least one image.');
        return;
      }

      // 2. check VeeValidate validation
      if (!values || Object.keys(values).length === 0) {
        console.warn('VeeValidate validation failed. Aborting submission.');
        this.$toast?.error?.(this.$t('create_ad.fill_required_fields') || 'Please fill all required fields.');
        return;
      }
    
      this.loading = true;
      console.log('Validation successful. Preparing data for submission...');

      const formData = new FormData();

      const makeName = this.makesStore.makes.find((m) => m.id == this.form.make)?.name || '';
      const modelName = this.carStore.models.find((m) => m.id == this.form.model)?.name || '';

      const adPayload = {
        ...this.form, 
        ...values,   
        name: `${makeName} ${modelName} ${this.form.year}`,
        advertiser: this.authStore.advertiser.id,
      };
      delete adPayload.imagesData; 

      for (const key in adPayload) {
        if (adPayload[key] !== null && adPayload[key] !== undefined) {
          formData.append(key, adPayload[key]);
        }
      }

      const { files, featured_file } = this.form.imagesData;
      
      // add featured image first
      if (featured_file) {
        formData.append('photos[]', featured_file, featured_file.name);
      }

      // add other images
      files.forEach(file => {
        if (!featured_file || file.name !== featured_file.name || file.size !== featured_file.size) {
          formData.append('photos[]', file, file.name);
        }
      });
      
      console.log('FormData prepared. Sending to store...');

      try {
        const success = await this.adsStore.createAd(formData);

        if (success) {
          this.$toast?.success?.(this.$t('create_ad.success_message') || 'Ad created successfully!');
          this.$router.push({name: 'dashboard'});
        } else {
          this.$toast?.error?.(this.adsStore.error || this.$t('create_ad.error_message') || 'Failed to create ad.');
          console.error('Failed to create ad:', this.adsStore.error);
        }
      } catch (error) {
        this.$toast?.error?.(error.message || this.$t('create_ad.error_message'));
        console.error('An unexpected error occurred during ad creation:', error);
      } finally {
        this.loading = false;
      }
    },
  },
}
</script>
