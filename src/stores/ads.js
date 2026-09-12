import { defineStore } from 'pinia'
import http from '../utils/http'
import { adsData } from '@/data/adsData'

export const useAdsStore = defineStore('ads', {
  state: () => ({
    ads: [],
    adsId: '',
    currentAd: null,
    totalAds: 0,
    loading: false,
    error: null,
    message: '',
  }),

  actions: {
    // Fetch ads from local mock data
    async fetchAds({
      make = '',
      model = '',
      name = '',
      min_price = '',
      max_price = '',
      phone = '',
      sort_order = '',
      advertiserId = '',
      transmission = '',
      drive_line = '',
      fuel = '',
      cylinders = '',
      exterior = '',
      interior = '',
      state = '',
      city = '',
      year_from = '',
      year_to = '',
    } = {}) {
      this.loading = true
      this.error = null

      try {
        let filteredAds = [...adsData]

        // Filter by make
        if (make) {
          filteredAds = filteredAds.filter((ad) => ad.make_id === make)
        }

        // Filter by model
        if (model) {
          filteredAds = filteredAds.filter((ad) => ad.model_id === model)
        }

        // Search by name
        if (name) {
          filteredAds = filteredAds.filter((ad) =>
            ad.name?.toLowerCase().includes(name.toLowerCase()),
          )
        }

        // Minimum price
        if (min_price !== '') {
          filteredAds = filteredAds.filter((ad) => Number(ad.price) >= Number(min_price))
        }

        // Maximum price
        if (max_price !== '') {
          filteredAds = filteredAds.filter((ad) => Number(ad.price) <= Number(max_price))
        }

        // Filter by phone
        if (phone) {
          filteredAds = filteredAds.filter((ad) => ad.phone?.includes(phone))
        }

        // Filter by advertiser
        if (advertiserId) {
          filteredAds = filteredAds.filter(
            (ad) => String(ad.advertiser_id) === String(advertiserId),
          )
        }

        // Filter by transmission
        if (transmission) {
          filteredAds = filteredAds.filter((ad) => ad.transmission?.includes(transmission))
        }

        // Filter by drive line
        if (drive_line) {
          filteredAds = filteredAds.filter((ad) => ad.drive_line?.includes(drive_line))
        }

        // Filter by fuel
        if (fuel) {
          filteredAds = filteredAds.filter((ad) => ad.fuel_type.includes(fuel))
        }

        // Filter by cylinders
        if (cylinders) {
          filteredAds = filteredAds.filter((ad) => Number(ad.cylinders) === Number(cylinders))
        }

        // Filter by exterior
        if (exterior) {
          filteredAds = filteredAds.filter((ad) => ad.exterior_color?.includes(exterior))
        }

        // Filter by interior
        if (interior) {
          filteredAds = filteredAds.filter((ad) => ad.interior_color?.includes(interior))
        }

        // Filter by state
        if (state) {
          filteredAds = filteredAds.filter((ad) => ad.state?.includes(state))
        }

        // Filter by city
        if (city) {
          filteredAds = filteredAds.filter((ad) => ad.city?.includes(city))
        }

        // Filter by year from
        if (year_from !== '') {
          filteredAds = filteredAds.filter((ad) => Number(ad.year) >= Number(year_from))
        }

        // Filter by year to
        if (year_to !== '') {
          filteredAds = filteredAds.filter((ad) => Number(ad.year) <= Number(year_to))
        }

        // Sort by date
        if (sort_order === 'asc') {
          filteredAds.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        } else if (sort_order === 'desc') {
          filteredAds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        } else if (sort_order === 'price_asc') {
          filteredAds.sort((a, b) => Number(a.price) - Number(b.price))
        } else if (sort_order === 'price_desc') {
          filteredAds.sort((a, b) => Number(b.price) - Number(a.price))
        }

        this.ads = filteredAds
        this.totalAds = filteredAds.length

        console.log('Local ads fetched:', this.ads)

        return this.ads
      } catch (error) {
        console.error(error)

        this.error = error?.message || 'An error occurred while fetching ads.'

        this.ads = []
        this.totalAds = 0

        return []
      } finally {
        this.loading = false
      }
    },

    // Fetch a single ad from local mock data
    async fetchAdById(id) {
      this.loading = true
      this.error = null
      this.currentAd = null

      try {
        const ad = adsData.find((item) => String(item.id) === String(id))

        if (!ad) {
          throw new Error('Car not found.')
        }

        this.currentAd = ad

        console.log('Local car details fetched:', this.currentAd)

        return this.currentAd
      } catch (error) {
        console.error('Error fetching car details:', error)

        this.error = error?.message || 'An error occurred while fetching car details.'

        this.currentAd = null

        throw error
      } finally {
        this.loading = false
      }
    },

    // Increment views locally
    async incrementAdView(adId) {
      this.error = null
      this.message = ''

      try {
        const ad = adsData.find((item) => String(item.id) === String(adId))

        if (ad) {
          ad.views = (ad.views || 0) + 1

          // Keep currentAd in sync
          if (this.currentAd && String(this.currentAd.id) === String(adId)) {
            this.currentAd.views = ad.views
          }
        }

        this.message = 'View counted successfully.'

        return true
      } catch (error) {
        console.error('Error adding view:', error)

        this.error = error?.message || 'An error occurred while adding view.'

        return false
      }
    },

    // Create ad - will be replaced with local logic later
    async createAd(formData, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        formData.append('lang', lang)

        const response = await http.post('', formData, {
          params: {
            route: 'ads/create',
          },
        })

        this.message = response.data.message
        this.adsId = response.data.ads_id

        console.log('Ad created successfully:', response.data)

        return response.data.success
      } catch (error) {
        console.error('Error creating ad in store:', error.response || error)

        this.error =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error.message ||
          'An unknown error occurred while creating the ad.'

        return false
      } finally {
        this.loading = false
      }
    },

    // Update ad - will be replaced with local logic later
    async updateAd(formData, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        formData.append('lang', lang)

        const response = await http.post('', formData, {
          params: {
            route: 'ads/update',
          },
        })

        this.message = response.data.message

        console.log('Ad updated successfully:', response.data)

        return response.data.success
      } catch (error) {
        console.error('Error updating ad in store:', error.response || error)

        this.error =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error.message ||
          'An unknown error occurred while updating the ad.'

        return false
      } finally {
        this.loading = false
      }
    },

    // Fetch photos - will be replaced with local logic later
    async getPhotos(adId, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null

      try {
        const response = await http.get('', {
          params: {
            route: 'ads/getPhotos',
            id: adId,
            lang: lang,
          },
        })

        console.log('Photos fetched:', response.data)

        const responseData = response.data.data.photos

        return responseData || []
      } catch (error) {
        console.log(error)

        this.error =
          error?.response?.data?.error ||
          error.message ||
          'An error occurred while fetching photos.'

        return []
      } finally {
        this.loading = false
      }
    },

    // Insert photos - will be replaced with local logic later
    async insertPhotos(formData, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        formData.append('lang', lang)

        const response = await http.post('', formData, {
          params: {
            route: 'ads/insertPhotos',
          },
        })

        this.message = response.data.message

        console.log(this.message)

        return response.data.success || false
      } catch (error) {
        console.log(error)

        this.error =
          error?.response?.data?.error ||
          error.message ||
          'An error occurred while inserting photos.'

        return false
      } finally {
        this.loading = false
      }
    },

    // Delete photo - will be replaced with local logic later
    async deletePhoto(formData, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      this.message = ''

      formData.append('lang', lang)

      try {
        const response = await http.post('', formData, {
          params: {
            route: 'ads/delPhoto',
          },
        })

        this.message = response.data.message

        console.log('Photo deleted successfully:', response.data)

        return response.data.success || false
      } catch (error) {
        console.error('Error deleting photo in store:', error.response || error)

        this.error =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error.message ||
          'An unknown error occurred while deleting the photo.'

        return false
      } finally {
        this.loading = false
      }
    },
  },
})
