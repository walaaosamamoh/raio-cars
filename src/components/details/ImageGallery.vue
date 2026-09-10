<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
    <div class="relative">
      <!-- Main Image -->
      <img :src="activeImage" alt="Main car image" class="w-full h-96 object-cover cursor-pointer" @click="openLightbox">
      
      <!-- Navigation Buttons with RTL support -->
      <button @click.stop="prevImage" class="absolute start-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors z-10">‹</button>
      <button @click.stop="nextImage" class="absolute end-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors z-10">›</button>
      
      <!-- Zoom Icon with RTL support -->
      <button @click.stop="openLightbox" class="absolute top-4 end-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" />
        </svg>
      </button>

      <!-- Photo Counter with RTL support -->
      <span class="absolute bottom-4 end-4 bg-black/60 text-white text-sm px-2 py-1 rounded z-10">
        {{ activeIndex + 1 }} / {{ photos.length }}
      </span>
    </div>
    
    <!-- Thumbnails with custom scrollbar -->
    <div class="p-4">
      <div class="flex overflow-x-auto space-x-2 py-2 thumbnail-scrollbar">
        <img 
          v-for="(image, index) in photos" 
          :key="index" 
          :src="image" 
          @click="setActiveImage(index)"
          :class="['w-32 h-20 object-cover rounded-md cursor-pointer border-2 flex-shrink-0 transition-all', activeIndex === index ? 'border-primary dark:border-primary-dark' : 'border-transparent opacity-60 hover:opacity-100']"
          alt="Car thumbnail"
        >
      </div>
    </div>

    <!-- Lightbox with Keyboard Support -->
    <div v-if="isLightboxOpen" class="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center p-4">
      <button @click="closeLightbox" class="absolute top-4 end-4 text-white text-4xl z-10 font-bold hover:opacity-75 transition">&times;</button>
      
      <div class="relative w-full max-w-4xl flex-grow flex items-center min-h-0">
        <img :src="activeImage" alt="Lightbox car image" class="w-full h-auto max-h-full object-contain">
        
        <!-- Lightbox Navigation with RTL support -->
        <button @click.stop="prevImage" class="absolute start-0 md:-start-12 top-1/2 -translate-y-1/2 text-white p-3 text-3xl hover:opacity-75 transition">‹</button>
        <button @click.stop="nextImage" class="absolute end-0 md:-end-12 top-1/2 -translate-y-1/2 text-white p-3 text-3xl hover:opacity-75 transition">›</button>
      </div>

      <!-- Lightbox Thumbnails -->
      <div class="w-full max-w-4xl mt-4 mx-auto h-28 flex-shrink-0">
        <div class="flex overflow-x-auto space-x-2 p-2 thumbnail-scrollbar">
          <img 
            v-for="(image, index) in photos" 
            :key="'thumb-' + index" 
            :src="image" 
            @click="setActiveImage(index)"
            :class="['h-20 w-auto flex-shrink-0 rounded-md cursor-pointer border-2 transition-all', activeIndex === index ? 'border-primary dark:border-primary-dark' : 'border-transparent opacity-60 hover:opacity-100']"
            alt="Lightbox thumbnail"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageGallery',
  props: {
    photos: { 
      type: Array, 
      default: () => [] 
    }
  },
  data() {
    return {
      activeIndex: 0,
      isLightboxOpen: false, 
    };
  },
  computed: {
    activeImage() {
      return this.photos[this.activeIndex] || '';
    },
  },
  methods: {
    setActiveImage(index) {
      this.activeIndex = index;
    },
    nextImage() {
      this.activeIndex = (this.activeIndex + 1) % this.photos.length;
    },
    prevImage() {
      this.activeIndex = (this.activeIndex - 1 + this.photos.length) % this.photos.length;
    },
    openLightbox() {
      this.isLightboxOpen = true;
      document.body.style.overflow = 'hidden';
      // Listen for keyboard events when lightbox is open
      window.addEventListener('keydown', this.handleKeydown);
    },
    closeLightbox() {
      this.isLightboxOpen = false;
      document.body.style.overflow = 'auto';
      // Stop listening for keyboard events
      window.removeEventListener('keydown', this.handleKeydown);
    },
    // Handles keyboard navigation for the lightbox
    handleKeydown(event) {
      if (!this.isLightboxOpen) return;
      
      if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'Escape') {
        this.closeLightbox();
      }
    }
  },
  // Cleanup listener when the component is destroyed
  beforeUnmount() {
    document.body.style.overflow = 'auto';
    window.removeEventListener('keydown', this.handleKeydown);
  }
};
</script>

<style scoped>
/* Custom scrollbar for thumbnails */
.thumbnail-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.thumbnail-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.thumbnail-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db; /* Light gray */
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.thumbnail-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af; /* Darker gray on hover */
}

/* Custom scrollbar for dark mode */
.dark .thumbnail-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563; /* Darker gray for dark mode */
}
.dark .thumbnail-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280; /* Lighter gray on hover in dark mode */
}
</style>