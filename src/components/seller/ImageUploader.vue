<template>

    <div class="space-y-4">
      <!-- Drag & Drop Upload Area -->
      <div
        @drop.prevent="handleDrop"
        @dragover.prevent="dragOver = true"
        @dragleave="dragOver = false"
        :class="[
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          dragOver
            ? 'border-primary bg-primary/5'
            : hasImages
              ? 'border-green-200 bg-green-50'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary/50',
        ]"
        @click="$refs.fileInput.click()"
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
          :class="[
            'w-12 h-12 mx-auto mb-3 transition-colors',
            hasImages ? 'text-green-500' : 'text-gray-400',
          ]"
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

        <p
          :class="[
            'mb-2 transition-colors',
            hasImages ? 'text-green-700' : 'text-gray-600 dark:text-gray-400',
          ]"
        >
          {{ hasImages ? $t('create_ad.images_selected_count', { count: selectedFiles.length }) : $t('create_ad.upload_instructions') }}
        </p>

        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('create_ad.upload_formats') }}
        </p>

        <!-- Required Indicator -->
        <div class="mt-2">
          <span
            class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            {{ $t('create_ad.required') }}
          </span>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="showError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
      >
        <p class="text-red-500 dark:text-red-200 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          {{ $t('validation.images_required') }}
        </p>
      </div>

      <!-- Featured Image Preview -->
      <div
        v-if="featuredImage"
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
      >
        <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {{ $t('create_ad.featured_image') }}
        </h3>
        <img :src="featuredImage.preview" alt="Featured" class="w-full h-64 object-cover rounded-lg border-2 border-primary shadow-sm" />
      </div>

      <!-- Selected Images Preview -->
      <div v-if="selectedFiles.length > 0" class="mt-4">
        <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('create_ad.selected_files') }} ({{ selectedFiles.length }})
            </h4>
            <button
              type="button"
              @click="removeAllFiles"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ $t('create_ad.remove_all') }}
            </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div
            v-for="file in selectedFiles"
            :key="file.id"
            :class="[
              'relative group rounded-lg border-2 transition-all',
              file.isFeatured ? 'border-primary bg-primary/5' : 'border-transparent',
            ]"
          >
            <img :src="file.preview" alt="Preview" class="w-full h-24 object-cover rounded-lg" />

            <!-- Action Buttons -->
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2"
            >
              <button
                type="button"
                @click.stop="setFeaturedImage(file.id)"
                :class="[
                  'text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors',
                  file.isFeatured ? 'bg-yellow-500' : 'bg-blue-500 hover:bg-blue-600',
                ]"
                :title="file.isFeatured ? $t('create_ad.featured') : $t('create_ad.set_featured')"
              >
                ★
              </button>
              <button
                type="button"
                @click.stop="removeFile(file.id)"
                class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                :title="$t('create_ad.remove')"
              >
                ×
              </button>
            </div>

            <!-- Featured Badge -->
            <div
              v-if="file.isFeatured"
              class="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Minimum Requirement Notice -->
      <div v-if="!hasImages" class="text-center">
        <p class="text-red-500 dark:primary-dark text-sm">
          {{ $t('create_ad.min_images_required') }}
        </p>
      </div>
    </div>

</template>

<script>
export default {
  name: 'ImageUploader',

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        files: [],
        featured_file: null,
      }),
    },
    required: {
      type: Boolean,
      default: true,
    },
    showValidation: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'change', 'validation'],
  data() {
    return {
      dragOver: false,
      selectedFiles: [], // Array of { id, file, preview, isFeatured }
    };
  },
  computed: {
    featuredImage() {
      return this.selectedFiles.find((f) => f.isFeatured) || this.selectedFiles[0] || null;
    },
    hasImages() {
      return this.selectedFiles.length > 0;
    },
    showError() {
      return this.required && this.showValidation && !this.hasImages;
    },
    isValid() {
      return !this.required || this.hasImages;
    },
  },
  methods: {
    handleFileSelect(event) {
      const files = Array.from(event.target.files).filter((f) => f.type.startsWith('image/'));
      this.addFiles(files);
      event.target.value = ''; // Reset input to allow selecting the same file again
    },
    handleDrop(event) {
      this.dragOver = false;
      const files = Array.from(event.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      this.addFiles(files);
    },
    addFiles(files) {
      const newFiles = files.filter(file =>
        !this.selectedFiles.some(existingFile =>
            existingFile.file.name === file.name && existingFile.file.size === file.size
        )
      );

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedFiles.push({
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            isFeatured: this.selectedFiles.length === 0, // Make first image featured
          });
        };
        reader.readAsDataURL(file);
      });
    },
    removeFile(fileId) {
      const index = this.selectedFiles.findIndex((f) => f.id === fileId);
      if (index !== -1) {
        const wasFeatured = this.selectedFiles[index].isFeatured;
        this.selectedFiles.splice(index, 1);

        // If the removed image was featured, make the new first image featured
        if (wasFeatured && this.selectedFiles.length > 0) {
          this.selectedFiles[0].isFeatured = true;
        }
      }
    },
    removeAllFiles() {
      this.selectedFiles = [];
    },
    setFeaturedImage(fileId) {
      this.selectedFiles.forEach((file) => {
        file.isFeatured = file.id === fileId;
      });
    },
    emitUpdate() {
      const featuredFileObj = this.selectedFiles.find(f => f.isFeatured);

      const payload = {
        files: this.selectedFiles.map(f => f.file),
        featured_file: featuredFileObj ? featuredFileObj.file : (this.selectedFiles.length > 0 ? this.selectedFiles[0].file : null),
      };

      this.$emit('update:modelValue', payload);
      this.$emit('change', payload);
      this.$emit('validation', this.isValid);
    },
  },
  watch: {
    selectedFiles: {
      handler() {
        this.emitUpdate();
      },
      deep: true,
    },
    // Watch for external changes to showValidation
    showValidation: {
      handler() {
        // This can be used to trigger validation display from the parent
      },
    },
  },
  mounted() {
    // Emit initial state
    this.emitUpdate();
  },
};
</script>
