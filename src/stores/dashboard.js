import { defineStore } from 'pinia'
import http from '../utils/http'

export const useDashboardStore = defineStore('dashboardStore', {
  state: () => ({
    loading: false,
    error: null,
    followersCount: 0,
    viewsCount: 0
  }),
  actions: {
    // fetch followers count for a given advertiser
    async fetchFollowersCount(advertiserId, lang = localStorage.getItem('language') || 'en') {
      try{
        const response = await http.get('', {
        params: {
          route: 'dash/getFollowersCount',
          advertiser: advertiserId,
          lang: lang
        }
      })
        this.followersCount = response.data.data.num || 0
        return true
      } catch(error){
        console.log(error)
        return false
      } finally {
        this.loading = false
      }
    },

    // fetch views count for a given advertiser
    async fetchViewsCount(advertiserId, lang = localStorage.getItem('language') || 'en') {
      try{
        const response = await http.get('', {
        params: {
          route: 'dash/getViewCount',
          advertiser: advertiserId,
          lang: lang
        }
      })
        this.viewsCount = response.data.data.num || 0
        return true
      } catch(error){
        console.log(error)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
