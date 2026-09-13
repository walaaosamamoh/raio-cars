import { defineStore } from 'pinia'

export const useFollowStore = defineStore('followStore', {
  state: () => ({
    isFollowing: false,
    loading: false,
    error: null,
  }),

  actions: {
    getFollows() {
      return JSON.parse(localStorage.getItem('follows') || '[]')
    },

    saveFollows(follows) {
      localStorage.setItem('follows', JSON.stringify(follows))
    },

    async checkFollowStatus(advertiserId, followerId) {
      this.loading = true
      this.error = null

      try {
        if (!advertiserId || !followerId) {
          this.isFollowing = false
          return false
        }

        const follows = this.getFollows()

        this.isFollowing = follows.some(
          (follow) =>
            String(follow.advertiserId) === String(advertiserId) &&
            String(follow.followerId) === String(followerId),
        )

        return this.isFollowing
      } catch (error) {
        console.error(error)
        this.error = error?.message || 'An error occurred while checking follow status.'
        this.isFollowing = false
        return false
      } finally {
        this.loading = false
      }
    },

    async followAdvertiser(advertiserId, followerId) {
      this.loading = true
      this.error = null

      try {
        if (!advertiserId || !followerId) {
          return false
        }

        const follows = this.getFollows()

        const alreadyFollowing = follows.some(
          (follow) =>
            String(follow.advertiserId) === String(advertiserId) &&
            String(follow.followerId) === String(followerId),
        )

        if (!alreadyFollowing) {
          follows.push({
            advertiserId,
            followerId,
          })

          this.saveFollows(follows)
        }

        this.isFollowing = true

        console.log('Followed locally')

        return true
      } catch (error) {
        console.error(error)
        this.error = error?.message || 'An error occurred while following.'
        return false
      } finally {
        this.loading = false
      }
    },

    async unfollowAdvertiser(advertiserId, followerId) {
      this.loading = true
      this.error = null

      try {
        const follows = this.getFollows()

        const updatedFollows = follows.filter(
          (follow) =>
            !(
              String(follow.advertiserId) === String(advertiserId) &&
              String(follow.followerId) === String(followerId)
            ),
        )

        this.saveFollows(updatedFollows)

        this.isFollowing = false

        console.log('Unfollowed locally')

        return true
      } catch (error) {
        console.error(error)
        this.error = error?.message || 'An error occurred while unfollowing.'
        return false
      } finally {
        this.loading = false
      }
    },
  },
})
