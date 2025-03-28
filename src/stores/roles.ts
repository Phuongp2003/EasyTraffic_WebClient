import { defineStore } from 'pinia'
import { apiRequest } from '@/utils/apiUtils'

interface Role {
  id: number
  name: string
  permissions?: string[]
}

export const useRolesStore = defineStore('roles', {
  state: () => ({
    roles: [] as Role[],
    loading: false,
  }),

  actions: {
    async fetchRoles() {
      try {
        this.loading = true
        const { data } = await apiRequest<Role[]>({ url: '/roles', method: 'GET' })
        this.roles = data
      } catch (error) {
        console.error('Lấy danh sách vai trò thất bại:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createRole(role: Omit<Role, 'id'>) {
      try {
        const { data } = await apiRequest<Role>({ url: '/roles', method: 'POST', data: role })
        this.roles.push(data)
        return data
      } catch (error) {
        console.error('Tạo vai trò thất bại:', error)
        throw error
      }
    },
  },
})
