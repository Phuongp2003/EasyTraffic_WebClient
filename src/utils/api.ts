import axios from 'axios'
import { api } from '../plugins/axios'

export async function fetchAdvisors() {
  try {
    const response = await api.get('/advisors')
    return {
      status: response.status,
      message: 'Advisors retrieved successfully',
      errMsg: null,
      data: response.data,
      timestamp: new Date().toISOString(),
      responseStatus: 'success',
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status || 500,
        message: 'Failed to retrieve advisors',
        errMsg: error.message,
        data: [],
        timestamp: new Date().toISOString(),
        responseStatus: 'error',
      }
    }
    return {
      status: 500,
      message: 'An unknown error occurred',
      errMsg: 'Unknown error',
      data: [],
      timestamp: new Date().toISOString(),
      responseStatus: 'error',
    }
  }
}
