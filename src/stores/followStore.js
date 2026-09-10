import { defineStore } from 'pinia'
import http from '../utils/http'

export const useFollowStore = defineStore('followStore', {
  state: ()=>({
    isFollowing: false,
    loading: false,
    error: null
  }),

  actions: {
    async checkFollowStatus(advertiserId, followerId, lang = localStorage.getItem('language') || 'en'){
      this.loading = true
      this.error = null
      try{
        const response = await http.get('',{
            params:{
              route: 'follow/get',
              advertiser: advertiserId,
              follower: followerId,
              lang: lang
            }
        })
        this.isFollowing= response.data.data.num == 1
        console.log(this.isFollowing)
        return response.data.success
      }catch(error){
        console.log(error)
        this.error= error.response.error.message || error.message
        this.isFollowing= false
        return false
      }finally{
        this.loading= false
      }
    },

    async followAdvertiser(advertiserId, followerId, lang = localStorage.getItem('language') || 'en'){
      this.loading = true
      this.error = null
      const formData = new FormData()
      formData.append('advertiser', advertiserId)
      formData.append('follower', followerId)
      formData.append('lang', lang)
      try{
        const response = await http.post('', formData,{
            params:{
              route: 'follow/create',
            }
        })
        this.isFollowing= true
        console.log('followed')
        return response.data.success
      }catch(error){
        console.log(error)
        this.error= error?.response?.error.message || error.message || 'An error occurred while following.'
        this.isFollowing= false
        return false
      }finally{
        this.loading= false
      }
    },

    async unfollowAdvertiser(advertiserId, followerId, lang = localStorage.getItem('language') || 'en'){
      this.loading = true
      this.error = null
      const formData = new FormData()
      formData.append('advertiser', advertiserId)
      formData.append('follower', followerId)
      formData.append('lang', lang)
      try{
          await http.post('', formData,{
            params:{
              route: 'follow/delete',
            }
          })
        this.isFollowing= false
        console.log('unfollowed')
        return true
      }catch(error){
        console.log(error)
        this.error= error?.response?.data?.error?.message || error.message || 'An error occurred while unfollowing.'
        return false
      }finally{
        this.loading= false
      }
    }
  }
})