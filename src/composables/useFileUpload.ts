import { ref } from 'vue'
import { api } from '@/plugins/axios'

export interface UploadResponse {
  url: string
  secure_url: string
  public_id: string
}

export function useFileUpload() {
  const isUploading = ref(false)

  async function uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('image', file)

    isUploading.value = true
    try {
      const { data } = await api.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data
    } finally {
      isUploading.value = false
    }
  }

  return {
    uploadFile,
    isUploading,
  }
}
