// src/stores/carData.js
import { defineStore } from 'pinia'
import http from '../utils/http'

export const useCarDataStore = defineStore('carData', {
  state: () => ({
    models: [],
    years: [],
    fuelTypes: [],
    transmissions: [],
    drivetrains: [],
    cylinders: [],
    colors: [],
    odometers: [],
    options: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchCarData() {
      this.loading = true
      this.error = null
      try {
        const lang = localStorage.getItem('language') || 'en'
        const nameField = lang === 'ar' ? 'name_ar' : 'name_en'

        const [fuelRes, transRes, driveRes, cylRes, colorRes, odoRes, optRes] = await Promise.all([
          http.get('', { params: { route: 'fuel_types/list', lang } }),
          http.get('', { params: { route: 'transmission/list', lang } }),
          http.get('', { params: { route: 'drivetrains/list', lang } }),
          http.get('', { params: { route: 'cylinders/list', lang } }),
          http.get('', { params: { route: 'colors/list', lang } }),
          http.get('', { params: { route: 'odometer/list', lang } }),
          http.get('', { params: { route: 'options/list', lang } }),
        ])

        // extract names based on language
        this.fuelTypes = (fuelRes.data || []).map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar
        }))

        this.transmissions = (transRes.data || []).map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar
        }))

        this.drivetrains = (driveRes.data || []).map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar
        }))

        this.cylinders =  (cylRes.data || []).map(item => ({
          id: item.id,
          name: item.count
        }))

        this.colors = (colorRes.data || []).map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar
        }))

        this.odometers = (odoRes.data || []).map(item => ({
          id: item.id,
          name: item.kilometers
        }))

        this.options = (optRes.data || []).map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar
        }))

      } catch (error) {
        console.error('Error:', error)
        this.error = error.message || 'Failed to fetch car data'
      } finally {
        this.loading = false
      }
    },

    async fetchModels(makeId) {
      this.models = []
      if (!makeId) return

      try {
        const lang = localStorage.getItem('language') || 'en'
        const nameField = lang === 'ar' ? 'name_ar' : 'name_en'

        const response = await http.get('', {
          params: { route: 'models/list', make: makeId, lang }
        })

        this.models = (response.data || []).map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar
        }))
        console.log(this.models)

      } catch (error) {
        console.error('Error:', error)
        this.error = error.message || 'Failed to fetch models'
      }
    },
  }
})
