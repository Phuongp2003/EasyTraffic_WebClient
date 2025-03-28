import { ref } from 'vue'
import { apiRequest } from '../utils/apiUtils'

interface RawTag {
  id: string
  name: string
  parentId: string | null
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  parent: string | null
  createdAt: string
}

export function useTags() {
  const tags = ref<Tag[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Keep raw data for reference
  const rawTags = ref<RawTag[]>([])

  const transformTags = (rawData: RawTag[]): Tag[] => {
    return rawData.map((tag) => ({
      id: tag.id,
      name: tag.name,
      parent: tag.parentId ? rawData.find((t) => t.id === tag.parentId)?.name || null : null,
      createdAt: tag.createdAt,
    }))
  }

  const fetchTags = async () => {
    loading.value = true
    try {
      const response = await apiRequest<RawTag[]>({ url: '/tags', method: 'GET' })
      rawTags.value = response.data
      tags.value = transformTags(response.data)
    } catch {
      error.value = 'Lấy danh sách thẻ thất bại'
    } finally {
      loading.value = false
    }
  }

  const createTag = async (tag: Omit<RawTag, 'id' | 'createdAt'>) => {
    try {
      const response = await apiRequest<RawTag>({ url: '/tags', method: 'POST', data: tag })
      rawTags.value.push(response.data)
      tags.value = transformTags(rawTags.value)
      return response.data
    } catch (err) {
      error.value = 'Tạo thẻ thất bại'
      throw err
    }
  }

  const updateTag = async (id: string, tag: Partial<Omit<RawTag, 'createdAt'>>) => {
    try {
      const response = await apiRequest<RawTag>({ url: `/tags/${id}`, method: 'PUT', data: tag })
      const index = rawTags.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        rawTags.value[index] = response.data
        tags.value = transformTags(rawTags.value)
      }
      return response.data
    } catch (err) {
      error.value = 'Cập nhật thẻ thất bại'
      throw err
    }
  }

  const deleteTag = async (id: string) => {
    try {
      await apiRequest<void>({ url: `/tags/${id}`, method: 'DELETE' })
      rawTags.value = rawTags.value.filter((t) => t.id !== id)
      tags.value = transformTags(rawTags.value)
    } catch (err) {
      error.value = 'Xóa thẻ thất bại'
      throw err
    }
  }

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
  }
}
