import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { advertiserData } from '@/data/advertiserData'

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
    // Send OTP locally
    async sendOtp(phone) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        this.phone = phone

        this.message = 'OTP sent successfully. Use 1234 for demo login.'

        console.log('Demo OTP: 1234')

        return true
      } catch (error) {
        console.error(error)

        this.error = error?.message || 'An error occurred while sending OTP.'

        return false
      } finally {
        this.loading = false
      }
    },

    // Verify OTP locally
    async verifyOtp(otp) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        // Demo OTP
        if (String(otp) !== '1234') {
          this.error = 'Invalid OTP. Please use 1234.'
          return false
        }

        this.otp = otp

        // Find advertiser using the phone number
        let advertiser = advertiserData.find((item) => item.phone === this.phone)

        // If no advertiser exists with this phone,
        // use the first demo advertiser for testing
        if (!advertiser) {
          advertiser = advertiserData[0]
        }

        this.token = `demo-token-${advertiser.id}`
        this.advertiserId = advertiser.id
        this.advertiserName = advertiser.name
        this.advertiser = advertiser

        Cookies.set('auth-token', this.token, {
          expires: 7,
          secure: import.meta.env.MODE === 'production',
        })

        Cookies.set('advertiser-id', String(this.advertiserId), {
          expires: 7,
          secure: import.meta.env.MODE === 'production',
        })

        this.message = 'OTP verified successfully.'

        console.log('Logged in advertiser:', advertiser)

        return true
      } catch (error) {
        console.error(error)

        this.error = error?.message || 'An error occurred while verifying OTP.'

        return false
      } finally {
        this.loading = false
      }
    },

    // Create advertiser locally
    async createAdvertiser(phone, name, photo) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        // Check if advertiser already exists
        const existingAdvertiser = advertiserData.find((item) => item.phone === phone)

        if (existingAdvertiser) {
          this.error = 'An advertiser with this phone number already exists.'
          return false
        }

        const newAdvertiser = {
          id: advertiserData.length + 1,
          name,
          phone,
          whatsapp: phone,
          photo: photo || '/images/users/default-avatar.webp',
          about: '',
          state: '',
          city: '',
          ads_count: 0,
          followers: 0,
          created_at: new Date().toISOString().split('T')[0],
        }

        advertiserData.push(newAdvertiser)

        this.advertiser = newAdvertiser
        this.advertiserName = newAdvertiser.name
        this.advertiserId = newAdvertiser.id

        this.message = 'Advertiser created successfully.'

        console.log('Advertiser created locally:', newAdvertiser)

        return true
      } catch (error) {
        console.error(error)

        this.error = error?.message || 'An error occurred while creating advertiser.'

        return false
      } finally {
        this.loading = false
      }
    },

    // Get logged-in advertiser
    async getAdvertiser(id) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        const advertiser = advertiserData.find((item) => String(item.id) === String(id))

        if (!advertiser) {
          throw new Error('Advertiser not found.')
        }

        this.advertiser = advertiser
        this.advertiserName = advertiser.name

        return true
      } catch (error) {
        console.error(error)

        this.error = error?.message || 'An error occurred while fetching advertiser.'

        return false
      } finally {
        this.loading = false
      }
    },

    // Update logged-in advertiser profile locally
    async updateProfile({ name, about, avatarFile }) {
      this.loading = true
      this.error = null
      this.message = ''

      try {
        const advertiser = advertiserData.find(
          (item) => String(item.id) === String(this.advertiserId),
        )

        if (!advertiser) {
          throw new Error('Advertiser not found.')
        }

        // Update text fields
        advertiser.name = name
        advertiser.about = about

        // Update profile photo if a new file was selected
        if (avatarFile) {
          advertiser.photo = await new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = () => resolve(reader.result)

            reader.onerror = () => {
              reject(new Error('Failed to read profile photo.'))
            }

            reader.readAsDataURL(avatarFile)
          })
        }

        // Update auth store state
        this.advertiser = { ...advertiser }
        this.advertiserName = advertiser.name
        this.phone = advertiser.phone

        this.message = 'Profile updated successfully.'

        console.log('Profile updated locally:', advertiser)

        return true
      } catch (error) {
        console.error('Error updating profile:', error)

        this.error = error?.message || 'An error occurred while updating profile.'

        return false
      } finally {
        this.loading = false
      }
    },

    // Get advertiser for SellerProfileView
    // Does not modify logged-in advertiser state
    async getAdvertiserForView(id) {
      try {
        const advertiser = advertiserData.find((item) => String(item.id) === String(id))

        if (!advertiser) {
          throw new Error('Advertiser not found.')
        }

        return advertiser
      } catch (error) {
        console.error('Error fetching advertiser for view:', error)

        throw error
      }
    },

    // Increment advertiser profile views locally
    async incrementAdvertiserProfileView(advertiserId) {
      this.error = null
      this.message = ''

      try {
        const advertiser = advertiserData.find((item) => String(item.id) === String(advertiserId))

        if (advertiser) {
          advertiser.profile_views = (advertiser.profile_views || 0) + 1
        }

        this.message = 'Profile view counted successfully.'

        return true
      } catch (error) {
        console.error('Error adding advertiser profile view:', error)

        this.error = error?.message || 'An error occurred while adding profile view.'

        return false
      }
    },

    logout() {
      this.advertiser = {}
      this.advertiserName = ''
      this.advertiserId = ''
      this.phone = ''
      this.otp = ''
      this.token = null

      Cookies.remove('auth-token')
      Cookies.remove('advertiser-id')

      console.log('Logged out successfully.')
    },
  },
})
