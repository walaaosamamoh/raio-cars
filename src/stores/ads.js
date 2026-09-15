import { defineStore } from 'pinia'
import { adsData } from '@/data/adsData'
import { advertiserData } from '@/data/advertiserData'

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

    async createAd(formData) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        const data = Object.fromEntries(formData.entries())

        // Get advertiser
        const advertiserId = Number(data.advertiser_id)

        if (!Number.isFinite(advertiserId) || advertiserId <= 0) {
          throw new Error('Please select an advertiser.')
        }

        const advertiser = advertiserData.find(
          (item) => Number(item.id) === advertiserId,
        )

        if (!advertiser) {
          throw new Error(`Advertiser ${advertiserId} not found.`)
        }

        // Read uploaded images
        const photos = []
        const uploadedPhotos = formData.getAll('photos[]')

        for (const file of uploadedPhotos) {
          if (file instanceof File) {
            const imageUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader()

              reader.onload = () => resolve(reader.result)
              reader.onerror = () => reject(new Error('Failed to read image.'))

              reader.readAsDataURL(file)
            })

            photos.push(imageUrl)
          }
        }

        // Generate new ad ID
        const newId = Math.max(...adsData.map((ad) => Number(ad.id)), 0) + 1

        // Create new ad
        const newAd = {
          ...data,

          id: newId,

          // Car information
          make: data.make_name,
          model: data.model_name,

          year: Number(data.year) || null,
          price: Number(data.price) || 0,
          odometer: Number(data.odometer) || 0,
          keys: Number(data.keys) || 0,

          // Images
          photos,
          featured_image: photos[0] || '',

          // Advertiser
          advertiser_id: advertiserId,
          advertiser: advertiser,

          // Ad information
          status: 'active',
          created_at: new Date().toISOString(),

          // Statistics
          views: 0,
          shares: 0,
          followers: 0,
          viewsHistory: [],
        }

        // Remove temporary form fields
        delete newAd.make_name
        delete newAd.model_name
        delete newAd.imagesData

        // Add ad to local data
        adsData.push(newAd)
        this.ads.push(newAd)

        this.totalAds = this.ads.length

        // Update advertiser's ad count
        advertiser.ads_count = Number(advertiser.ads_count || 0) + 1

        this.message = 'Ad created successfully.'

        return true
      } catch (error) {
        console.error('Error creating ad:', error)

        this.error = error?.message || 'An error occurred while creating the ad.'

        return false
      } finally {
        this.loading = false
      }
    },

    async updateAd(updatedAd) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        const index = adsData.findIndex((ad) => String(ad.id) === String(updatedAd.id))

        if (index === -1) {
          throw new Error('Ad not found.')
        }

        Object.assign(adsData[index], updatedAd)

        this.ads = this.ads.map((ad) =>
          String(ad.id) === String(updatedAd.id) ? { ...ad, ...updatedAd } : ad,
        )

        if (this.currentAd?.id === updatedAd.id) {
          this.currentAd = { ...this.currentAd, ...updatedAd }
        }

        this.message = 'Ad updated successfully.'
        return true
      } catch (error) {
        console.error('Error updating ad:', error)
        this.error = error?.message || 'Failed to update ad.'
        return false
      } finally {
        this.loading = false
      }
    },

    async deleteAd(id) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        const index = adsData.findIndex((ad) => String(ad.id) === String(id))

        if (index === -1) {
          throw new Error('Ad not found.')
        }

        adsData.splice(index, 1)

        this.ads = this.ads.filter((ad) => String(ad.id) !== String(id))

        this.totalAds = this.ads.length
        this.message = 'Ad deleted successfully.'

        return true
      } catch (error) {
        this.error = error?.message || 'An error occurred while deleting the ad.'
        return false
      } finally {
        this.loading = false
      }
    },

    async getPhotos(adId) {
      this.loading = true
      this.error = null

      try {
        const ad = adsData.find((item) => String(item.id) === String(adId))

        if (!ad) {
          throw new Error('Ad not found.')
        }

        return (ad.photos || []).map((photo, index) => ({
          id: `${ad.id}-${index}`,
          photo,
          is_featured: index === 0,
        }))
      } catch (error) {
        console.error('Error fetching photos:', error)

        this.error = error?.message || 'An error occurred while fetching photos.'

        return []
      } finally {
        this.loading = false
      }
    },

    async insertPhotos(formData) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        const adId = formData.get('id')

        const ad = adsData.find((item) => String(item.id) === String(adId))

        if (!ad) {
          throw new Error('Ad not found.')
        }

        const uploadedFiles = formData.getAll('photos')
        const newPhotos = []

        for (const file of uploadedFiles) {
          if (!(file instanceof File)) continue

          const imageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(new Error('Failed to read image.'))

            reader.readAsDataURL(file)
          })

          newPhotos.push(imageUrl)
        }

        ad.photos = [...(ad.photos || []), ...newPhotos]

        ad.featured_image = ad.photos[0] || ''

        this.currentAd = { ...ad }

        this.message = 'Photos uploaded successfully.'

        return true
      } catch (error) {
        console.error('Error inserting photos:', error)

        this.error = error?.message || 'An error occurred while inserting photos.'

        return false
      } finally {
        this.loading = false
      }
    },

    async deletePhoto(adId, photoId) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        const ad = adsData.find((item) => String(item.id) === String(adId))

        if (!ad) {
          throw new Error('Ad not found.')
        }

        const photoIndex = Number(String(photoId).split('-').pop())

        if (Number.isNaN(photoIndex) || photoIndex < 0 || photoIndex >= ad.photos.length) {
          throw new Error('Photo not found.')
        }

        ad.photos.splice(photoIndex, 1)

        ad.featured_image = ad.photos[0] || ''

        this.currentAd = { ...ad }

        this.message = 'Photo deleted successfully.'

        return true
      } catch (error) {
        console.error('Error deleting photo:', error)

        this.error = error?.message || 'An error occurred while deleting the photo.'

        return false
      } finally {
        this.loading = false
      }
    },
  },
})
