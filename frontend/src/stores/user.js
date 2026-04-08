// 用户状态管理
import { defineStore } from 'pinia'
import { userAPI } from '../utils/api.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    username: null,
    isLoggedIn: false,
    loading: false
  }),

  actions: {
    async login(username, password, isRegister = false) {
      this.loading = true
      try {
        let data
        
        if (isRegister) {
          // 注册
          data = await userAPI.register(username, password)
        } else {
          // 登录
          data = await userAPI.login(username, password)
        }
        
        if (data.success) {
          this.userId = data.data.userId
          this.username = username
          this.isLoggedIn = true
          
          // 保存登录状态
          localStorage.setItem('userId', data.data.userId)
          localStorage.setItem('username', username)
          
          return { success: true }
        } else {
          return { success: false, message: data.message }
        }
      } catch (error) {
        console.error('登录失败:', error)
        return { success: false, message: '登录失败' }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.userId = null
      this.username = null
      this.isLoggedIn = false
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      localStorage.removeItem('savedPassword')
    },

    // 从本地存储恢复登录状态
    restoreLogin() {
      const userId = localStorage.getItem('userId')
      const username = localStorage.getItem('username')
      
      if (userId && username) {
        this.userId = userId
        this.username = username
        this.isLoggedIn = true
      }
    }
  }
})