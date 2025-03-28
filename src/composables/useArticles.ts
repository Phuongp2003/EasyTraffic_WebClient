import { ref } from 'vue'
import { apiRequest } from '../utils/apiUtils'
import type { Article } from '@/types'

export interface ArticlePayload {
  title: string
  description: string
  content: string
  type: string
  status: string
  slug: string
  coverImage?: File | string
  backgroundImage?: File | string
}

export function useArticles() {
  const articles = ref<Article[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)
  const itemsPerPage = ref(10)

  const fetchArticles = async (type: string, page = 1, limit = 10) => {
    loading.value = true
    error.value = null
    currentPage.value = page
    itemsPerPage.value = limit

    try {
      const response = await apiRequest<{
        items: Article[]
        currentPage: number
        totalPages: number
        totalItems: number
      }>({
        url: '/articles',
        method: 'GET',
        params: {
          type,
          page,
          limit,
        },
      })

      // Access items directly from response.data
      articles.value = response.data.items

      // Get pagination data from response
      totalPages.value = response.data.totalPages || 1
      totalItems.value = response.data.totalItems || 0
      currentPage.value = response.data.currentPage || 1
    } catch (err) {
      error.value = 'Tải danh sách bài viết thất bại!'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      return true
    }
    return false
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      return true
    }
    return false
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      return true
    }
    return false
  }

  const getArticleBySlug = async (slug: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiRequest<Article>({ url: `/articles/${slug}`, method: 'GET' })
      return response.data
    } catch (err) {
      error.value = 'Tải chi tiết bài viết thất bại!'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createArticle = async (article: ArticlePayload) => {
    try {
      const response = await apiRequest<Article>({
        url: '/articlesManagement',
        method: 'POST',
        data: article,
      })
      return response.data
    } catch (err) {
      console.error(err)
      throw new Error('Tạo bài viết thất bại!')
    }
  }

  const updateArticle = async (slug: string, article: ArticlePayload) => {
    try {
      const response = await apiRequest<Article>({
        url: `/articlesManagement/${slug}`,
        method: 'PUT',
        data: article,
      })
      return response.data
    } catch (err) {
      console.error(err)
      throw new Error('Cập nhật bài viết thất bại!')
    }
  }

  const deleteArticle = async (slug: string) => {
    try {
      await apiRequest<void>({ url: `/articlesManagement/${slug}`, method: 'DELETE' })
      articles.value = articles.value.filter((t) => t.slug !== slug)
    } catch (err) {
      console.error(err)
      throw new Error('Xoá bài viết thất bại!')
    }
  }

  function generateSlug(title: string): string {
    const randomString = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substring(0, 5)
    const slug = `${title}-${randomString}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, '') // Remove all non-word characters
    return slug
  }

  return {
    articles,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchArticles,
    nextPage,
    prevPage,
    goToPage,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle,
    generateSlug,
  }
}
