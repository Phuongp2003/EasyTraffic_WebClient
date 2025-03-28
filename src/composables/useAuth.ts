import { useCookies } from '@vueuse/integrations/useCookies'
import { ref, watchEffect } from 'vue'
import { api } from '../plugins/axios'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

const cookies = useCookies(['accessToken', 'refreshToken'])

export const useAuth = () => {
  const accessToken = ref(cookies.get('accessToken'))
  const refreshToken = ref(cookies.get('refreshToken'))

  const setTokens = (access: string, refresh: string) => {
    // Set tokens in cookies with expiration
    cookies.set(ACCESS_TOKEN_KEY, access, {
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    })

    cookies.set(REFRESH_TOKEN_KEY, refresh, {
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    // Update refs
    accessToken.value = access
    refreshToken.value = refresh
  }

  const clearTokens = () => {
    console.log('Clear')
    cookies.remove(ACCESS_TOKEN_KEY)
    cookies.remove(REFRESH_TOKEN_KEY)
    console.log(cookies)
    accessToken.value = null
    refreshToken.value = null
  }

  const logout = async () => {
    try {
      if (refreshToken.value) {
        await api.post('/auth/logout', {
          token: refreshToken.value,
        })
      }
    } catch (error) {
      console.error('Lỗi đăng xuất:', error)
    } finally {
      console.log('clear?')
      clearTokens()
      console.log('clear?')
    }
  }

  // Keep refs in sync with cookies
  watchEffect(() => {
    const cookieAccessToken = cookies.get(ACCESS_TOKEN_KEY)
    const cookieRefreshToken = cookies.get(REFRESH_TOKEN_KEY)

    if (cookieAccessToken !== accessToken.value) {
      accessToken.value = cookieAccessToken
    }
    if (cookieRefreshToken !== refreshToken.value) {
      refreshToken.value = cookieRefreshToken
    }
  })

  return {
    accessToken,
    refreshToken,
    setTokens,
    clearTokens,
    logout,
  }
}
