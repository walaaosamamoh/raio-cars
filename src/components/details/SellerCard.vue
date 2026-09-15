<template>

  <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-4">

    <!-- Price Section -->
    <div class="text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">Price</p>
      <p class="text-3xl font-bold text-primary dark:text-primary-dark">{{ Number(price).toLocaleString() }} SDG</p>
    </div>

    <!-- Seller Info Section -->
    <!-- Using gap-4 for automatic RTL spacing -->
    <div class="flex items-center gap-4 border-t border-b border-gray-200 dark:border-gray-700 py-4">
      <img :src="seller.photo ||'/images/default-avatar.png'" alt="Seller avatar" class="h-16 w-16 rounded-full object-cover">
      <div>
        <!-- Assuming a seller profile page exists -->
        <router-link :to="{ name: 'sellerProfile', params: { id: seller.id } }"
        class="font-bold text-lg text-gray-800 dark:text-white hover:underline">
          {{ seller.name }}
        </router-link>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ seller.adsCount }} {{$t('carDetails.ads')}} | {{ seller.followers }} {{$t('carDetails.followers')}}</p>
      </div>
    </div>

    <!-- Contact Buttons Section -->
    <div class="space-y-3 pt-2">
      <a
        :href="`https://wa.me/${seller.whatsapp}`"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full flex items-center justify-center gap-3 text-center bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
      >
        <font-awesome-icon :icon="['fab', 'whatsapp']" class="h-5 w-5" />
        <span>{{ $t('carDetails.whatsapp') }}</span>
      </a>
      <a
        :href="`tel:${seller.phone}`"
        class="w-full flex items-center justify-center gap-3 text-center bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-300"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.1 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.13.87.38 1.7.73 2.46a2 2 0 0 1-.45 2.66L8.09 9.91a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.66-.45c.76.35 1.59.6 2.46.73A2 2 0 0 1 22 16.92z" />
          </svg>
        <span>{{$t('carDetails.call')}}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellerCard',
  props: {
    seller: {
      type: Object,
      required: true,
    },
    price: {
      type: [String, Number],
      required: true,
    },
  },
};
</script>
