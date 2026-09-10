// src/stores/states.js
import { defineStore } from 'pinia'
import http from '../utils/http'

export const useStatesStore = defineStore('states', {
  state: () => ({
    states: [],
    cities: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchStates(lang) {
      this.loading = true
      this.error = null
      try {
        lang = lang || localStorage.getItem('language') || 'en'
        const nameField = lang === 'ar' ? 'name_ar' : 'name_en'
        const response = await http.get('', {
          params: { route: 'states/list', lang }
        })
        this.states = (response.data || []).map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar
        }))
      } catch (error) {
        this.error = error.message || 'Failed to fetch states'
      } finally {
        this.loading = false
      }
    },

    async fetchCities(stateId) {
      this.cities = []
      if (!stateId) return

      try {
        const lang = localStorage.getItem('language') || 'en'
        const nameField = lang === 'ar' ? 'name_ar' : 'name_en'
        const response = await http.get('', {
          params: { route: 'cities/list', state: stateId, lang }
        })
        this.cities = (response.data || []).map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar
        }))
      } catch (error) {
        this.error = error.message || 'Failed to fetch cities'
      }
    }
  }
})