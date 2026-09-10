import { defineStore } from 'pinia'
import http from '../utils/http'

export const useAdsStore = defineStore('ads', {
  state: () => ({
    ads: [],
    adsId: '',
    currentAd: null,
    totalAds: 0,
    loading: false,
    error: null,
    message: ''
  }),

  actions: {
    async fetchAds({
      lang = localStorage.getItem('language') || 'en',
      make = '',
      model ='',
      name = '',
      min_price = '',
      max_price = '',
      phone = '',
      sort_order = '',
      advertiserId = ''
    } = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await http.get('', {
          params: {
            route: 'ads/cards',
            lang,
            make,
            model,
            name,
            min_price,
            max_price,
            phone,
            sort_order,
            advertiserId
          }
        })
        this.ads = response.data.data || []
        console.log(this.ads)
        this.totalAds = response.data.total_records || 0
      } catch (error) {
        console.log(error)
        this.error = error?.response?.data?.error || error.message || 'An error occurred while fetching ads.'
        this.ads = []
      } finally {
        this.loading = false
      }
    },

    async fetchAdById(id, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      this.currentAd = null

      try {
        const response = await http.get('', {
          params: {
            route: 'ads/get',
            id: id,
            lang: lang
          }
        })

        this.currentAd = response.data.data || response.data
        console.log('Car details fetched:', this.currentAd)
        return this.currentAd

      } catch (error) {
        console.error('Error fetching car details:', error)
        this.error = error?.response?.data?.error || error.message || 'An error occurred while fetching car details.'
        this.currentAd = null
        throw error
      } finally {
        this.loading = false
      }
    },

    async incrementAdView(adId, lang = localStorage.getItem('language') || 'en'){
      this.loading = true;
      this.error = null;
      this.message = '';

      try{
        const formData = new FormData()
        formData.append('id', adId)
        formData.append('lang', lang)

        const response = await http.post('', formData, {
          params: {
            route: 'ads/addView'
          }
        })
        this.message= response.data.message
        console.log(this.message)
        return true
      }catch(error){
        this.error= error?.response?.data?.error || error.message || 'An error occurred while adding view'
        return false
      }finally {
        this.loading= false
      }
    },

    async createAd(formData, lang = localStorage.getItem('language') || 'en') {
      this.loading = true;
      this.error = null;
      this.message = '';

      try {
        formData.append('lang', lang);

        const response = await http.post('', formData, {
          params: {
            route: 'ads/create'
          }
        });

        this.message = response.data.message;
        this.adsId = response.data.ads_id;

        console.log('Ad created successfully:', response.data);

        return response.data.success
      } catch (error) {
        console.error('Error creating ad in store:', error.response || error);
        this.error = error?.response?.data?.error ||
                     error?.response?.data?.message ||
                     error.message ||
                     'An unknown error occurred while creating the ad.';

        return false;
      } finally {
        this.loading = false;
      }
    },

    async updateAd(formData, lang = localStorage.getItem('language') || 'en') {
      this.loading = true;
      this.error = null;
      this.message = '';

      try {
        formData.append('lang', lang);

        const response = await http.post('', formData, {
          params: {
            route: 'ads/update'
          }
        });

        this.message = response.data.message;
        console.log('Ad updated successfully:', response.data);

        return response.data.success
      } catch (error) {
        console.error('Error updating ad in store:', error.response || error);
        this.error = error?.response?.data?.error ||
                     error?.response?.data?.message ||
                     error.message ||
                     'An unknown error occurred while updating the ad.';

        return false;
      } finally {
        this.loading = false;
      }
    },

    // Fetch photos for a specific ad
    async getPhotos(adId, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      try {
        const response = await http.get('', {
          params: {
            route: 'ads/getPhotos',
            id: adId,
            lang: lang
          }
        })
        console.log('Photos fetched:', response.data)
        const responseData= response.data.data.photos
        return responseData || []
      } catch (error) {
        console.log(error)
        this.error = error?.response?.data?.error || error.message || 'An error occurred while fetching photos.'
        return []
      } finally {
        this.loading = false
      }
    },

    // Insert photos for a specific ad
    async insertPhotos(formData, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      this.message = ''
      try {

        formData.append('lang', lang)

        const response = await http.post('', formData, {
          params: {
            route: 'ads/insertPhotos'
          }
        })
        this.message = response.data.message
        console.log(this.message)
        return response.data.success || false
      } catch (error) {
        console.log(error)
        this.error = error?.response?.data?.error || error.message || 'An error occurred while inserting photos.'
        return false
      } finally {
        this.loading = false
      }
    },

    async deletePhoto(formData, lang = localStorage.getItem('language') || 'en') {
      this.loading = true;
      this.error = null;
      this.message = '';

      formData.append('lang', lang)

      try {
        const response = await http.post('', formData, {
        params: {
          route: 'ads/delPhoto',
        }
      });
        this.message = response.data.message;
        console.log('Photo deleted successfully:', response.data);
        return response.data.success || false;
      }catch (error) {
        console.error('Error deleting photo in store:', error.response || error);
        this.error = error?.response?.data?.error ||
                     error?.response?.data?.message ||
                     error.message ||
                     'An unknown error occurred while deleting the photo.';
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
})
