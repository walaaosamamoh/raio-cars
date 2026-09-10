import { defineStore } from 'pinia'
import http from '../utils/http'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    phone: '',
    otp: '',
    token: Cookies.get('auth-token') || null,
    advertiser: {},
    advertiserName: '',
    advertiserId: Cookies.get('advertiser-id') || '',
    loading: false,
    error: null,
    message: '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async sendOtp(phone, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      this.message = ''
      try {
        const formData = new FormData()
        formData.append('lang', lang)
        formData.append('phone', phone)

        const response = await http.post('', formData, {
          params: {
            route: 'login/createOTP',
          },
        })
        this.phone = phone
        this.message = response.data.message || 'OTP sent successfully.'
        return response.data.success || false
      } catch (error) {
        console.log(error)
        this.error =
          error?.response?.data?.error || error.message || 'An error occurred while sending OTP.'
        return false
      } finally {
        this.loading = false
      }
    },

    async verifyOtp(otp, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      this.message = ''
      try {
        const response = await http.get('', {
          params: {
            route: 'login/getOTP',
            code: otp,
            lang: lang,
          },
        })
        if (response.data.success === false) {
          this.error = response.data.message || 'Invalid OTP.'
          return false
        }
        this.otp = otp
        this.token = response.data[0].token
        this.advertiserName = response.data[0].name
        this.advertiserId = response.data[0].id
        console.log('Advertiser Name:', this.advertiserName)
        console.log('advId:', this.advertiserId)

        Cookies.set('auth-token', this.token, {
          expires: 7, // Expires in 7 days
          secure: import.meta.env.MODE === 'production', // Use secure cookies in production
        })
        // Also store advertiser ID in cookies
        Cookies.set('advertiser-id', this.advertiserId, {
          expires: 7,
          secure: import.meta.env.MODE === 'production',
        })
        this.message = response.data.message || 'OTP verified successfully.'
        return true
      } catch (error) {
        console.log(error)
        this.error =
          error?.response?.data?.message ||
          error.message ||
          'An error occurred while verifying OTP.'
        return false
      } finally {
        this.loading = false
      }
    },

    async createAdvertiser(phone, name, photo, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      this.message = ''
      try {
        const formData = new FormData()
        formData.append('phone', phone)
        formData.append('name', name)
        formData.append('photo', photo)
        formData.append('lang', lang)

        const response = await http.post('', formData, {
          params: {
            route: 'advertisers/create',
          },
        })
        this.advertiserName = name
        this.message = response.data.message || 'Advertiser created successfully.'
        return true
      } catch (error) {
        console.log(error)
        this.error =
          error?.response?.data?.error ||
          error.message ||
          'An error occurred while creating advertiser.'
        return false
      } finally {
        this.loading = false
      }
    },

    async getAdvertiser(id, lang = localStorage.getItem('language') || 'en') {
      this.loading = true
      this.error = null
      this.message = ''
      try {
        const response = await http.get('', {
          params: {
            route: 'advertisers/get',
            id: id,
            lang: lang,
          },
        })
        this.advertiser = response.data[0] || []
        this.advertiserName = this.advertiser.name || ''
        console.log(this.advertiser)
        return true
      } catch (error) {
        this.error =
          error?.response?.data?.message ||
          error.message ||
          'An error occurred while fetching advertisers.'
        return false
      } finally {
        this.loading = false
      }
    },

    // Fetch advertiser data for viewing purposes without modifying the store state
    // Used in SellerProfile view
    // To prevent overwriting logged-in advertiser data
    async getAdvertiserForView(id, lang = localStorage.getItem('language') || 'en') {
      try {
        const response = await http.get('', {
          params: {
            route: 'advertisers/get',
            id: id,
            lang: lang,
          },
        })
        return response.data[0] || []
      } catch (error) {
        console.log('Error fetching advertiser for view:', error)
        throw error
      }
    },

    async incrementAdvertiserProfileView(
      advertiserId,
      lang = localStorage.getItem('language') || 'en',
    ) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        const formData = new FormData()
        formData.append('id', advertiserId)
        formData.append('lang', lang)

        const response = await http.post('', formData, {
          params: {
            route: 'advertisers/addView',
          },
        })
        this.message = response.data.message
        console.log(this.message)
        return true
      } catch (error) {
        this.error =
          error?.response?.data?.error || error.message || 'An error occurred while adding view'
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.advertiser = {}
      this.token = null
      Cookies.remove('auth-token')
      Cookies.remove('advertiser-id')
      console.log('Logged out successfully.')
    },
  },
})
