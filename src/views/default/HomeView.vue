<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Features Section -->
    <FeaturesSection />

    <!-- Make Section -->
    <MakeSection />

    <!-- Latest cars section -->
    <LatestCarsSection />

  </div>
</template>

<script>
import HeroSection from '@/components/home/HeroSection.vue'
import MakeSection from '@/components/home/MakeSection.vue'
import LatestCarsSection from '@/components/home/LatestCarsSection.vue'
import FeaturesSection from '@/components/home/FeaturesSection.vue'
  export default {
    name: 'HomeView',
    components: {
      HeroSection,
      MakeSection,
      LatestCarsSection,
      FeaturesSection
    }
  }
</script>

<style scoped>

</style>
