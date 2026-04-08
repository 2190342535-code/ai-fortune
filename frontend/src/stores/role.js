// 角色状态管理
import { defineStore } from 'pinia'
import { roleAPI } from '../utils/api.js'
import { getLunarDate, getZodiac, getSunSign, getYearElement } from '../utils/date.js'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [],
    activeRole: null,
    loading: false
  }),

  getters: {
    // 当前活跃角色
    currentRole: (state) => state.roles.find(r => r.is_active) || state.roles[0]
  },

  actions: {
    // 获取所有角色
    async fetchRoles() {
      this.loading = true
      try {
        const data = await roleAPI.getAll()
        this.roles = data.roles || []
        this.activeRole = this.roles.find(r => r.is_active) || null
      } catch (error) {
        console.error('获取角色失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 创建角色（自动计算数据）
    async createRole(roleData) {
      this.loading = true
      try {
        // 自动计算数据
        const autoData = {
          ...roleData,
          lunar_date: getLunarDate(roleData.birthday.year, roleData.birthday.month, roleData.birthday.day),
          zodiac: getZodiac(roleData.birthday.year),
          sun_sign: getSunSign(roleData.birthday.month, roleData.birthday.day),
          year_element: getYearElement(roleData.birthday.year)
        }
        
        const data = await roleAPI.create(autoData)
        this.roles.push(data.role)
        return data
      } catch (error) {
        console.error('创建角色失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 切换活跃角色
    async setActiveRole(roleId) {
      try {
        await roleAPI.setActive(roleId)
        this.roles.forEach(r => {
          r.is_active = r._id === roleId
        })
        this.activeRole = this.roles.find(r => r._id === roleId)
      } catch (error) {
        console.error('切换角色失败:', error)
        throw error
      }
    },

    // 删除角色
    async deleteRole(roleId) {
      try {
        await roleAPI.delete(roleId)
        this.roles = this.roles.filter(r => r._id !== roleId)
        if (this.activeRole?._id === roleId) {
          this.activeRole = this.roles[0] || null
        }
      } catch (error) {
        console.error('删除角色失败:', error)
        throw error
      }
    }
  }
})