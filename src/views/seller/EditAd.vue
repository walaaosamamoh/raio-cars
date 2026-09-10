v
<template>
  <div class="edit-ad-page p-4 lg:p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('edit_ad.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ $t('edit_ad.subtitle') }}
        </p>
      </div>

      <!-- Loading State for initial data fetch -->
      <div v-if="pageLoading" class="text-center py-12">
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
        <p class="text-gray-600 dark:text-gray-400">{{ $t('edit_ad.loading_data') }}</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
      >
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
        <button
          @click="initializePage"
          class="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          {{ $t('edit_ad.retry') }}
        </button>
      </div>

      <!-- Content after loading -->
      <div v-else>
        <!-- Tabs Navigation -->
        <div class="mb-6">
          <nav class="flex rounded-lg bg-gray-200 dark:bg-gray-800 p-1" role="tablist">
            <button
              type="button"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition',
                activeTab === 'details'
                  ? 'bg-white dark:bg-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-300',
              ]"
              @click="activeTab = 'details'"
              role="tab"
              :aria-selected="activeTab === 'details'"
            >
              {{ $t('edit_ad.details') || 'Details' }}
            </button>
            <button
              type="button"
              :class="[
                'ms-2 px-4 py-2 rounded-md text-sm font-medium transition',
                activeTab === 'photos'
                  ? 'bg-white dark:bg-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-300',
              ]"
              @click="activeTab = 'photos'"
              role="tab"
              :aria-selected="activeTab === 'photos'"
            >
              {{ $t('edit_ad.photos') || 'Photos' }}
            </button>
          </nav>
        </div>

        <!-- Details Tab with its own Form -->
        <div v-show="activeTab === 'details'">
          <VForm
            @submit="handleDetailsSubmit"
            :validation-schema="formValidationSchema"
            :initial-values="form"
          >
            <!-- All CarFormSection components go here -->
            <div class="space-y-6">
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
                  v-model="form.odometer"
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

              <CarFormSection
                :title="$t('create_ad.description')"
                grid-class="grid grid-cols-1 gap-6"
              >
                <VField
                  v-model="form.description"
                  as="textarea"
                  name="description"
                  rows="6"
                  class="w-full custom-input resize-none px-2"
                  :placeholder="$t('create_ad.description_placeholder')"
                />
                <div class="min-h-[24px]">
                  <VErrorMessage name="description" class="text-red-500 text-sm mt-1 block" />
                </div>
              </CarFormSection>
            </div>

            <!-- Submit button for the details form -->
            <div class="flex flex-col sm:flex-row gap-4 justify-end items-center mt-6">
              <router-link
                to="/seller/ads"
                class="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                >{{ $t('edit_ad.cancel') }}</router-link
              >
              <button
                type="submit"
                :disabled="detailsLoading"
                class="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span v-if="!detailsLoading">{{ $t('edit_ad.update') }}</span>
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

        <!-- Photos Tab -->
        <div v-show="activeTab === 'photos'">
          <CarFormSection :title="$t('create_ad.images')" grid-class="grid grid-cols-1 gap-6">
            <!-- The EditImageManager should be self-contained and handle its own API calls -->
            <EditImageManager :ad-id="adId" :initial-images="form.imagesData.images" />
          </CarFormSection>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCarDataStore } from '@/stores/carDataStore'
import { useMakesStore } from '@/stores/makes'
import { useStatesStore } from '@/stores/states'
import { useAdsStore } from '@/stores/ads'
import { useAuthStore } from '@/stores/auth'
import { mapState } from 'pinia'

import CarFormSection from '@/components/seller/CarFormSection.vue'
import FormSelect from '@/components/seller/FormSelect.vue'
import FormInput from '@/components/seller/FormInput.vue'
import EditImageManager from '@/components/seller/EditImageManager.vue'
import { buildCreateAdSchema } from '@/schemas/createAdSchema'

export default {
  name: 'EditAdPage',
  components: { CarFormSection, FormSelect, FormInput, EditImageManager },
  data() {
    return {
      pageLoading: true, // For initial page load
      detailsLoading: false, // For submitting the details form
      activeTab: 'details',
      error: null,
      adId: null,
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
          images: [],
        },
      },
    }
  },
  computed: {
    ...mapState(useCarDataStore, ['carLoading', 'getError']),
    carStore() {
      return useCarDataStore()
    },
    makesStore() {
      return useMakesStore()
    },
    stateStore() {
      return useStatesStore()
    },
    adsStore() {
      return useAdsStore()
    },
    authStore() {
      return useAuthStore()
    },
    formValidationSchema() {
      return buildCreateAdSchema(this.$t)
    },
  },
  async created() {
    this.adId = this.$route.params.id
    await this.initializePage()
  },
  methods: {
    async initializePage() {
      this.pageLoading = true
      this.error = null
      try {
        await Promise.all([
          this.carStore.fetchCarData(),
          this.makesStore.fetchMakes(),
          this.stateStore.fetchStates(),
          this.generateYears(),
        ])

        const adData = await this.adsStore.fetchAdById(this.adId)
        if (!adData) throw new Error('Ad not found.')

        await this.populateFormWithAdData(adData)
      } catch (error) {
        console.error('Error initializing edit page:', error)
        this.error = error?.message || 'Failed to load ad data'
      } finally {
        this.pageLoading = false
      }
    },

    async populateFormWithAdData(adData) {
      const findIdByName = (list, name) => {
        if (name === null || name === undefined || !Array.isArray(list)) return name
        const nameStr = String(name).toLowerCase()
        const found = list.find(
          (item) =>
            (item.name && String(item.name).toLowerCase() === nameStr) ||
            (item.name_en && String(item.name_en).toLowerCase() === nameStr) ||
            (item.name_ar && String(item.name_ar).toLowerCase() === nameStr),
        )
        return found ? found.id : name
      }

      const makeId = findIdByName(this.makesStore.makes, adData.make)
      if (makeId) {
        await this.carStore.fetchModels(makeId)
        this.form.model = findIdByName(this.carStore.models, adData.model)
      }
      this.form.make = makeId

      const stateId = findIdByName(this.stateStore.states, adData.state)
      if (stateId) {
        await this.stateStore.fetchCities(stateId)
        this.form.city = findIdByName(this.stateStore.cities, adData.city)
      }
      this.form.state = stateId

      this.form.year = adData.year
      this.form.price = adData.price
      this.form.phone = adData.phone
      this.form.whatsapp = adData.whatsapp
      this.form.description = adData.description
      this.form.keys = adData.keys
      this.form.transmission = findIdByName(this.carStore.transmissions, adData.transmission)
      this.form.fuel_type = findIdByName(this.carStore.fuelTypes, adData.fuel_type)
      this.form.drive_line = findIdByName(this.carStore.drivetrains, adData.drive_line)
      this.form.cylinders = findIdByName(this.carStore.cylinders, adData.cylinders)
      this.form.exterior_color = findIdByName(this.carStore.colors, adData.exterior_color)
      this.form.interior_color = findIdByName(this.carStore.colors, adData.interior_color)
      this.form.option = findIdByName(this.carStore.options, adData.option)
      this.form.odometer = findIdByName(this.carStore.odometers, adData.odometer)

      this.form.imagesData.images = Array.isArray(adData.photos) ? adData.photos : []
    },

    generateYears() {
      const currentYear = new Date().getFullYear()
      this.carStore.years = Array.from({ length: currentYear - 1989 }, (_, i) => ({
        id: currentYear - i,
        name: (currentYear - i).toString(),
      }))
    },

    async onMakeChange(makeId) {
      this.form.model = ''
      if (makeId) await this.carStore.fetchModels(makeId)
      else this.carStore.models = []
    },

    async onStateChange(stateId) {
      this.form.city = ''
      if (stateId) await this.stateStore.fetchCities(stateId)
      else this.stateStore.cities = []
    },

    async handleDetailsSubmit(values) {
      this.detailsLoading = true

      const formData = new FormData()
      formData.append('id', this.adId)
      formData.append('advertiser', this.authStore.advertiserId)

      const makeName = this.makesStore.makes.find((m) => m.id === values.make)?.name || ''
      const modelName = this.carStore.models.find((m) => m.id === values.model)?.name || ''
      formData.append('name', `${makeName} ${modelName} ${values.year}`.trim())

      for (const key in values) {
        if (values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key])
        }
      }

      try {
        const success = await this.adsStore.updateAd(formData)
        if (success) {
          this.$toast.success(
            this.adsStore.message || 'Ad details updated successfully.',
          )
          this.$router.push({name:'ads'})
        } else {
          throw new Error(this.adsStore.error || 'Failed to update details.')
        }
      } catch (error) {
        console.error('Error updating ad details:', error)
        this.$toast.error(
          error?.message || this.$t('edit_ad.update_error') || 'Failed to update ad details.',
        )
      } finally {
        this.detailsLoading = false
      }
    },
  },
}
</script>
