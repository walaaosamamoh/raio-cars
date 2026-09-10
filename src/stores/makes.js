import { defineStore } from 'pinia'
import { makesData } from '@/data/makesData'

// src/stores/states.js

export const useMakesStore = defineStore('makes', {
  state: () => ({
    makes: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMakes(language) {
      this.loading = true
      this.error = null
      try {
        const lang = language || localStorage.getItem('language') || 'en'
        const nameField = lang === 'ar' ? 'name_ar' : 'name_en'

        this.makes = makesData.map((make) => ({
          id: make.id,
          logo: make.logo,
          name: make[nameField] || make.name_en || make.name_ar,
        }))
      } catch (err) {
        this.error = err.message || 'Failed to fetch makes'
      } finally {
        this.loading = false
      }
    },
  },
})
