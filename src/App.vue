<template>
  <AppLayout />
</template>

<script>
import AppLayout from './layouts/AppLayout.vue'
import {useCarDataStore} from '@/stores/carDataStore'
import {useStatesStore} from '@/stores/states'
import {useMakesStore} from '@/stores/makes'
import {useAuthStore} from '@/stores/auth'
import Cookies from 'js-cookie'

export default {
  name: 'App',
  components: {
    AppLayout
  },
  data(){
    return {
      carDataStore: useCarDataStore(),
      statesStore: useStatesStore(),
      makesStore: useMakesStore(),
      authStore: useAuthStore(),
      id: Cookies.get('advertiser-id')
    }
  },
  mounted(){
    this.fetchAllData(this.$i18n.locale)
},
  methods: {
    async fetchAllData(lang) {
      const requests = [
        this.carDataStore.fetchCarData(lang),
        this.statesStore.fetchStates(lang),
        this.makesStore.fetchMakes(lang),
      ]

      if (this.id) {
        requests.push(this.authStore.getAdvertiser(this.id, lang))
      }

      try {
        await Promise.all(requests)
      } catch (error) {
        console.error('Failed to load application data:', error)
      }
    },
  },
  watch: {
    '$i18n.locale'(newLang) {
      this.fetchAllData(newLang)
    }
  }
}
</script>
