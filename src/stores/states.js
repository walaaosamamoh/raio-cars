// src/stores/states.js
import { statesData } from '@/data/statesData'
import { defineStore } from 'pinia'


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
        this.states = statesData.map(state => ({
          id: state.id,
          name: state[nameField] || state.name_en || state.name_ar
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
        const state = statesData.find((state=> state.id === stateId))
        if (!state) return
        this.cities = state.cities.map(city => ({
          id: city.id,
          name: city[nameField] || city.name_en || city.name_ar
        }))
      } catch (error) {
        this.error = error.message || 'Failed to fetch cities'
      }
    }
  }
})
