import { ref } from 'vue'
import { apiRequest } from '../utils/apiUtils'

export interface TeamMember {
  id: string
  fullName: string
  title: string
  email: string
  createdAt: string
  updatedAt: string
  roleId: number
}

export function useTeamMembers() {
  const teamMembers = ref<TeamMember[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTeamMembers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiRequest<TeamMember[]>({ url: '/users', method: 'GET' })
      teamMembers.value = response.data
    } catch (err) {
      error.value = 'Lấy danh sách thành viên thất bại'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
  }
}
