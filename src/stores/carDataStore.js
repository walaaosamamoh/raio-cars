// src/stores/carData.js
import { defineStore } from 'pinia'
import { carData } from '@/data/carData'

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
    error: null,
  }),

  actions: {
    async fetchCarData() {
      this.loading = true
      this.error = null

      try {
        const lang = localStorage.getItem('language') || 'en'
        const nameField = lang === 'ar' ? 'name_ar' : 'name_en'

        this.fuelTypes = carData.fuelTypes.map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar,
        }))

        this.transmissions = carData.transmissions.map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar,
        }))

        this.drivetrains = carData.drivetrains.map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar,
        }))

        this.cylinders = carData.cylinders.map(item => ({
          id: item.id,
          name: item.count,
        }))

        this.colors = carData.colors.map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar,
        }))

        this.odometers = carData.odometers.map(item => ({
          id: item.id,
          name: item.kilometers,
        }))

        this.options = carData.options.map(item => ({
          id: item.id,
          name: item[nameField] || item.name_en || item.name_ar,
        }))

        this.models = []
      } catch (error) {
        console.error('Error loading local car data:', error)
        this.error = error.message || 'Failed to load car data'
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

        this.models = carData.models
          .filter(item => String(item.make_id) === String(makeId))
          .map(item => ({
            id: item.id,
            name: item[nameField] || item.name_en || item.name_ar,
          }))

        console.log('Local models:', this.models)
      } catch (error) {
        console.error('Error loading models:', error)
        this.error = error.message || 'Failed to load models'
      }
    },
  },
})
