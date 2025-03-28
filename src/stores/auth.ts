import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

interface RegisterPayload {
  email: string
  password: string
  role: string // Changed from roleId: number
}

export const useAuthStore = defineStore('auth', {
  actions: {
    async register(payload: RegisterPayload) {
      try {
        const { data } = await api.post('/auth/register', payload)
        return data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Đăng ký người dùng thất bại')
      }
    },
  },
})
