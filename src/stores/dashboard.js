import { defineStore } from 'pinia'
import { advertiserData } from '@/data/advertiserData'
import { adsData } from '@/data/adsData'

export const useDashboardStore = defineStore('dashboardStore', {
  state: () => ({
    loading: false,
    error: null,
    followersCount: 0,
    viewsCount: 0,
  }),

  actions: {
    // Fetch followers count for a given advertiser
    async fetchFollowersCount(advertiserId) {
      this.loading = true
      this.error = null

      try {
        const advertiser = advertiserData.find(
          (item) => String(item.id) === String(advertiserId),
        )

        if (!advertiser) {
          throw new Error('Advertiser not found.')
        }

        this.followersCount = advertiser.followers || 0

        return true
      } catch (error) {
        console.error('Error fetching followers count:', error)
        this.error =
          error?.message || 'An error occurred while fetching followers count.'
        this.followersCount = 0
        return false
      } finally {
        this.loading = false
      }
    },

    // Fetch views count for a given advertiser
    async fetchViewsCount(advertiserId) {
      this.loading = true
      this.error = null

      try {
        const advertiserAds = adsData.filter(
          (ad) => String(ad.advertiser_id) === String(advertiserId),
        )

        this.viewsCount = advertiserAds.reduce(
          (total, ad) => total + (ad.views || 0),
          0,
        )

        return true
      } catch (error) {
        console.error('Error fetching views count:', error)
        this.error =
          error?.message || 'An error occurred while fetching views count.'
        this.viewsCount = 0
        return false
      } finally {
        this.loading = false
      }
    },
  },
})
