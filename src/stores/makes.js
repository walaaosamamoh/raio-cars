import { defineStore } from 'pinia'
import http from '../utils/http'

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
        const response = await http.get('', {
          params: {
            route: 'makes/list',
            lang: lang,
          },
        })
        this.makes = (response.data || []).map((item) => ({
          id: item.id,
          logo: item.logo,
          name: item[nameField] || item.name_en || item.name_ar,
        }))
      } catch (err) {
        this.error = err.message || 'Failed to fetch makes'
      } finally {
        this.loading = false
      }
    },
  },
})
