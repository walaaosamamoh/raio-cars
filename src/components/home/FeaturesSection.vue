<template>
  <section class="py-16 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Title -->
      <div class="text-center mb-12">
        <h2 class="md:text-3xl text-2xl font-bold text-gray-800 dark:text-white mb-3">
          {{ $t('home.features.title', 'Our Features') }}
        </h2>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <!-- Easy Search -->
        <article class="p-5 rounded-2xl flex flex-col justify-center items-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white mb-4">
            <!-- magnifier icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
            </svg>
          </div>
          <h3 class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {{ $t('home.features.easySearch.title', 'Easy Search') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-center">
            {{ $t('home.features.easySearch.desc', 'Find cars quickly with smart filters and categories.') }}
          </p>
        </article>

        <!-- Wide Selection -->
        <article class="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center">
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white mb-4">
            <!-- grid icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h6v6H4V6zm10 0h6v6h-6V6zM4 16h6v6H4v-6zm10 0h6v6h-6v-6z" />
            </svg>
          </div>
          <h3 class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {{ $t('home.features.wideSelection.title', 'Wide Selection') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-center">
            {{ $t('home.features.wideSelection.desc', 'Browse a variety of cars from trusted sellers in one place.') }}
          </p>
        </article>

        <!-- Direct Contact -->
        <article class="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center">
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white mb-4">
            <!-- phone/chat icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5a2 2 0 012-2h3l1 3-2 2a16 16 0 007 7l2-2 3 1v3a2 2 0 01-2 2h-1C9.82 22 2 14.18 2 4V3z" />
            </svg>
          </div>
          <h3 class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {{ $t('home.features.directContact.title', 'Direct Contact') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-center">
            {{ $t('home.features.directContact.desc', 'Chat or call sellers instantly via WhatsApp or phone.') }}
          </p>
        </article>

        <!-- Updated Listings -->
        <article class="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center">
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white mb-4">
            <!-- clock icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="9" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 7v5l3 2" />
            </svg>
          </div>
          <h3 class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {{ $t('home.features.updated.title', 'Updated Listings') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-center">
            {{ $t('home.features.updated.desc', 'Get access to the latest car listings every day.') }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturesSection',
}
</script>
