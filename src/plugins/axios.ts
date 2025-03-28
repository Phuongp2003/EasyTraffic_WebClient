import axios from 'axios'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default function setupAxios() {
  const { accessToken, refreshToken, setTokens, clearTokens } = useAuth()
  const router = useRouter()

  // Add access token to requests
  api.interceptors.request.use(
    (config) => {
      if (accessToken.value) {
        config.headers.Authorization = `Bearer ${accessToken.value}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Handle token expiration
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        if (refreshToken.value) {
          try {
            const response = await api.post('/auth/refresh-token', {
              token: refreshToken.value,
            })
            clearTokens()
            setTokens(response.data.accessToken, response.data.refreshToken)

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
            return api(originalRequest)
          } catch (refreshError) {
            clearTokens()
            router.push('/login')
            return Promise.reject(refreshError)
          }
        }
      }

      return Promise.reject(error)
    },
  )
}
