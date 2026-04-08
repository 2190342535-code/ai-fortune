// 用户状态管理
import { defineStore } from 'pinia'
import { userAPI } from '../utils/api.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    phone: null,
    isLoggedIn: false,
    loading: false
  }),

  actions: {
    async login(phone) {
      this.loading = true
      try {
        // 先尝试登录，失败则注册
        let data
        try {
          data = await userAPI.login(phone)
        } catch {
          data = await userAPI.register(phone)
        }
        
        this.userId = data.userId
        this.phone = phone
        this.isLoggedIn = true
        return data
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.userId = null
      this.phone = null
      this.isLoggedIn = false
    }
  }
})