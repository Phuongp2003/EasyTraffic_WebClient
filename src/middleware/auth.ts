// import { useAuth } from '../composables/useAuth'
import type { NavigationGuard } from 'vue-router'
// import { api } from '../plugins/axios'

export const authMiddleware: NavigationGuard = async (to, from, next) => {
  // Skip auth check for login and register routes
  return next()
  // const { accessToken, refreshToken, setTokens, clearTokens } = useAuth()
  // const publicRoutes = ['/login', '/register']

  // // Allow access to public routes
  // if (publicRoutes.includes(to.path)) {
  //   return next()
  // }
  // // Check if access token exists
  // if (!accessToken.value) {
  //   // If no access token, try to use refresh token
  //   if (refreshToken.value) {
  //     try {
  //       const response = await api.post('/auth/refresh-token', {
  //         token: refreshToken.value,
  //       })
  //       clearTokens()
  //       setTokens(response.data.accessToken, response.data.refreshToken)
  //       return next()
  //     } catch {
  //       clearTokens()
  //       return next('/login')
  //     }
  //   } else {
  //     // No tokens available, redirect to login
  //     return next('/login')
  //   }
  // }

  // // Access token exists, proceed
  // return next()
}
