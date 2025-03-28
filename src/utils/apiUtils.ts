import type { AxiosRequestConfig } from 'axios'
import type { AxiosResponse } from 'axios'
import { api } from '../plugins/axios'

interface ApiResponse<T> extends AxiosResponse<T> {
  items: any
  message: string
  errMsg?: string
  timestamp: string
  responseStatus: string
}

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const toast = useToast()
  try {
    const response = await api(config)
    if (response.data.responseStatus !== 'success') {
      toast.add({
        title: 'Lỗi lấy dữ liệu từ server!',
        description: response.data.errMsg,
        color: 'error',
      })
    }
    return response.data
  } catch (error) {
    toast.add({ title: '', description: String(error), color: 'error' })
    throw error
  }
}
