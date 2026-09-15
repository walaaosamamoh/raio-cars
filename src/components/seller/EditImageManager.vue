<template>
  <div class="space-y-6">
    <!-- 1. Dropzone for adding new photos -->
    <div
      @drop.prevent="handleFileDrop"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
        dragOver
          ? 'border-primary bg-primary/5'
          : 'border-gray-300 dark:border-gray-600 hover:border-primary/50',
      ]"
      @click="openFileDialog"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
      <svg
        class="w-12 h-12 mx-auto mb-3 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
      <p class="mb-2 text-gray-600 dark:text-gray-400">
        {{ $t('edit_ad.add_more_photos') || 'Click or drag & drop to add more photos' }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ $t('create_ad.upload_formats') || 'PNG, JPG, GIF up to 10MB' }}
      </p>
    </div>

    <!-- 2. Section for new photos ready to be uploaded -->
    <div v-if="filesToUpload.length > 0">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg text-gray-800 dark:text-gray-300 font-medium">
          {{ $t('edit_ad.new_photos_to_upload') || 'New Photos' }} ({{ filesToUpload.length }})
        </h3>
        <button
          @click="uploadAllNewFiles"
          :disabled="isUploading"
          class="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark disabled:bg-gray-400"
        >
          <span v-if="isUploading">{{ $t('edit_ad.uploading') || 'Uploading...' }}</span>
          <span v-else>{{ $t('edit_ad.upload_all') || 'Upload All' }}</span>
        </button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div
          v-for="item in filesToUpload"
          :key="item.id"
          :class="[
            'relative group rounded-lg border-2 transition-all',
            item.id === featuredNewFileId ? 'border-primary bg-primary/5' : 'border-transparent',
          ]"
        >
          <img :src="item.preview" alt="New preview" class="w-full h-24 object-cover rounded-lg" />
          <div
            class="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              @click="setNewAsFeatured(item.id)"
              :class="[
                'text-white rounded-full w-8 h-8 flex items-center justify-center',
                item.id === featuredNewFileId ? 'bg-yellow-500' : 'bg-blue-500 hover:bg-blue-600',
              ]"
              :title="
                item.id === featuredNewFileId
                  ? $t('create_ad.featured') || 'Featured'
                  : $t('create_ad.set_featured') || 'Set as featured'
              "
            >
              ★
            </button>
            <button
              @click="removeFileToUpload(item.id)"
              class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              :title="$t('create_ad.remove')"
            >
              ×
            </button>
          </div>
          <!-- Featured Badge for New Photos -->
          <div
            v-if="item.id === featuredNewFileId"
            class="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Section for photos already saved on the server -->
    <div>
      <h3 class="text-lg text-gray-800 dark:text-gray-300 font-medium mb-2">
        {{ $t('edit_ad.saved_photos') || 'Saved Photos' }} ({{ savedImages.length }})
      </h3>
      <div v-if="isLoading" class="text-center py-8">
        <p>Loading photos...</p>
      </div>
      <div
        v-else-if="savedImages.length === 0 && filesToUpload.length === 0"
        class="text-center py-8 text-gray-500"
      >
        {{ $t('edit_ad.no_photos_yet') || 'This ad has no photos yet. Add some!' }}
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div
          v-for="image in savedImages"
          :key="image.id"
          :class="[
            'relative group rounded-lg border-2 transition-all',
            image.is_featured ? 'border-primary bg-primary/5' : 'border-transparent',
          ]"
        >
          <img :src="image.photo" alt="Saved photo" class="w-full h-24 object-cover rounded-lg" />
          <div
            class="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              @click="setAsFeatured(image.id)"
              :class="[
                'text-white rounded-full w-8 h-8 flex items-center justify-center',
                image.is_featured ? 'bg-yellow-500' : 'bg-blue-500 hover:bg-blue-600',
              ]"
              :title="
                image.is_featured
                  ? $t('create_ad.featured') || 'Featured'
                  : $t('create_ad.set_featured') || 'Set as featured'
              "
            >
              ★
            </button>
            <button
              @click="handleDeleteSavedImage(image.id)"
              class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              :title="$t('create_ad.remove')"
            >
              ×
            </button>
          </div>
          <!-- Featured Badge for Saved Photos -->
          <div
            v-if="image.is_featured"
            class="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAdsStore } from '@/stores/ads'
import { swalMixin } from '@/mixins/swalMixin'
import Swal from 'sweetalert2'
import { toastService } from '@/services/toastService'

export default {
  name: 'EditImageManager',
  mixins: [swalMixin],
  props: {
    adId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      adsStore: useAdsStore(),
      dragOver: false,
      savedImages: [], // Holds images from the server { id, photo }
      filesToUpload: [], // Holds new files waiting for upload { id, file, preview }
      featuredNewFileId: null, // ID of the featured file among new uploads
      isLoading: false, // For fetching/deleting saved images
      isUploading: false, // For uploading new images
    }
  },
  async created() {
    await this.fetchSavedImages()
  },
  methods: {
    // --- DATA FETCHING ---
    async fetchSavedImages() {
      if (!this.adId) return
      this.isLoading = true
      try {
        this.savedImages = await this.adsStore.getPhotos(this.adId)
        console.log('savedPhoto', this.savedImages)
      } catch (error) {
        console.error('Failed to load existing photos:', error)
        alert('Failed to load existing photos.')
      } finally {
        this.isLoading = false
      }
    },

    // --- HANDLING NEW FILES ---
    openFileDialog() {
      this.$refs.fileInput.click()
    },
    handleFileSelect(event) {
      this.addFiles(Array.from(event.target.files))
      event.target.value = ''
    },
    handleFileDrop(event) {
      this.dragOver = false
      this.addFiles(Array.from(event.dataTransfer.files))
    },
    addFiles(files) {
      const newFiles = files
        .filter((f) => f.type.startsWith('image/'))
        .map((file) => ({
          id: `new-${Date.now()}-${Math.random()}`,
          file: file,
          preview: URL.createObjectURL(file),
        }))

      this.filesToUpload.push(...newFiles)
    },
    removeFileToUpload(fileId) {
      const index = this.filesToUpload.findIndex((f) => f.id === fileId)
      if (index === -1) return

      const removedFile = this.filesToUpload[index]
      URL.revokeObjectURL(removedFile.preview)
      this.filesToUpload.splice(index, 1)

      // If the removed file was the featured one, assign a new featured file
      if (removedFile.id === this.featuredNewFileId && this.filesToUpload.length > 0) {
        this.featuredNewFileId = this.filesToUpload[0].id
      }
    },
    setNewAsFeatured(fileId) {
      this.featuredNewFileId = fileId
    },

    // --- API INTERACTIONS ---
    async uploadAllNewFiles() {
      if (this.filesToUpload.length === 0) return
      this.isUploading = true

      try {
        const formData = new FormData()
        formData.append('id', this.adId)

        // Create a sorted list of files with the featured one first
        const orderedFiles = [...this.filesToUpload]
        const featuredIndex = orderedFiles.findIndex((f) => f.id === this.featuredNewFileId)
        if (featuredIndex > 0) {
          const [featuredFile] = orderedFiles.splice(featuredIndex, 1)
          orderedFiles.unshift(featuredFile)
        }

        // Append all files to the same FormData object
        orderedFiles.forEach((item) => {
          formData.append('photos', item.file) // Use 'photos' as the key
        })

        // Send a single request
        await this.adsStore.insertPhotos(formData)

        // Refresh the UI after successful upload
        await this.fetchSavedImages()
        this.filesToUpload = []
        this.featuredNewFileId = null
      } catch (error) {
        console.error('An error occurred during upload:', error)
        alert('Failed to upload new photos. Please try again.')
      } finally {
        this.isUploading = false
      }
    },

    async handleDeleteSavedImage(photoId) {
      const title = this.$t('edit_ad.confirm_delete_image') || 'Are you sure?'

      const text = this.$t('edit_ad.confirm_delete_image_text') || 'This action cannot be undone.'

      const confirmText = this.$t('create_ad.remove') || 'Yes, delete it!'

      const result = await this.$swalConfirm(title, text, confirmText)

      if (!result.isConfirmed) return

      const isDark = document.documentElement.classList.contains('dark')

      Swal.fire({
        title: this.$t('edit_ad.deleting') || 'Deleting...',
        allowOutsideClick: false,
        background: isDark ? '#1f2937' : '#fff',
        color: isDark ? '#fff' : '#000',
        didOpen: () => {
          Swal.showLoading()
        },
      })

      this.isLoading = true

      try {
        const success = await this.adsStore.deletePhoto(this.adId, photoId)

        Swal.close()

        if (!success) {
          throw new Error(this.adsStore.error || 'Failed to delete photo.')
        }

        toastService.success(this.$t('edit_ad.deleted_success') || 'Photo deleted successfully.')

        await this.fetchSavedImages()
      } catch (error) {
        Swal.close()

        console.error('Delete failed:', error)

        toastService.error(this.$t('edit_ad.deleted_error') || 'Failed to delete image.')
      } finally {
        this.isLoading = false
      }
    },
    // --- FEATURED IMAGE HANDLING ---
    async setAsFeatured(imageId) {
      this.savedImages.forEach((img) => {
        img.is_featured = img.id === imageId
      })
    },
  },
  beforeUnmount() {
    // Clean up any remaining blob URLs to prevent memory leaks
    this.filesToUpload.forEach((item) => URL.revokeObjectURL(item.preview))
  },
}
</script>
