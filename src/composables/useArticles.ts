import { ref } from 'vue'
import { apiRequest } from '../utils/apiUtils'

export interface Article {
  id: string
  title: string
  description?: string
  slug: string
  content: string
  tags: {
    primary: string
    subTags: string[]
  }
  tagId: string
  createdAt: string
  coverImage?: File | string
  backgroundImage?: File | string
  updatedAt: string
  status: string
  translations: ArticleTranslation[]
  Advisor: Advisor
  School: School
  VisaType: VisaType
  viewCount: number
}

export interface ArticleTranslation {
  language: string
  title: string
  content: string
  description?: string
  createdAt?: string
}

export interface ArticleTag {
  tag: {
    id: string
  }
}

export interface ArticlePayload {
  title: string
  description: string
  content: string
  type: string
  status: string
  slug: string
  coverImage?: File | string
  backgroundImage?: File | string
  lowestTags: string
  ArticleType?: string
  translations: ArticleTranslation[]
}

export interface Advisor {
  id: string
  title: string
  fullName: string
  groupId: string | null
  createdAt: string
  articleId: string
}

export interface School {
  id: string
  name: string
  address: string
  createdAt: string
  articleId: string
}

export interface VisaType {
  id: string
  name: string
  description: string
  createdAt: string
  articleId: string
}

export function useArticles() {
  const articles = ref<Article[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)
  const itemsPerPage = ref(10)

  const fetchArticles = async (tags?: string[], page = 1, limit = 10) => {
    loading.value = true
    error.value = null
    currentPage.value = page
    itemsPerPage.value = limit

    try {
      let allArticles: Article[] = []
      if (tags?.length) {
        for (const tag of tags) {
          const response = await apiRequest<{
            items: Article[]
            currentPage: number
            totalPages: number
          }>({
            url: '/articles',
            method: 'GET',
            params: {
              tag: tag,
              page,
              limit,
            },
          })
          console.log(response)
          // Access items directly from response.data.data
          allArticles = [...allArticles, ...response.data.items]

          // Get pagination data from response
          totalItems.value = 0
          totalPages.value = response.data.totalPages
          currentPage.value = response.data.currentPage
        }
        // Remove duplicates
        const uniqueArticles = new Map(allArticles.map((article) => [article.id, article]))
        allArticles = Array.from(uniqueArticles.values())
      } else {
        const response = await apiRequest<{
          items: Article[]
          currentPage: number
          totalPages: number
        }>({
          url: '/articles',
          method: 'GET',
          params: {
            page,
            limit,
          },
        })

        // Access items directly from response.data.data
        allArticles = response.data.items

        // Get pagination data from response
        totalPages.value = response.data.totalPages
        totalItems.value = 0
        currentPage.value = response.data.currentPage
      }
      articles.value = allArticles
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

  const manageRelatedEntity = async (
    articleId: string,
    entityType: 'Advisor' | 'School' | 'VisaType',
    entityData: unknown,
  ) => {
    try {
      const response = await apiRequest({
        url: `/api/${entityType.toLowerCase()}s/${articleId}`,
        method: 'PUT',
        data: entityData,
      })
      return response.data
    } catch (err) {
      console.error(`Quản lý ${entityType.toLowerCase()} thất bại`, err)
      throw new Error(`Quản lý ${entityType.toLowerCase()} thất bại`)
    }
  }

  const unlinkRelatedEntity = async (
    articleId: string,
    entityType: 'Advisor' | 'School' | 'VisaType',
  ) => {
    try {
      await apiRequest({
        url: `/api/${entityType.toLowerCase()}s/${articleId}`,
        method: 'DELETE',
      })
    } catch (err) {
      console.error(`Gỡ liên kết ${entityType.toLowerCase()} thất bại`, err)
      throw new Error(`Gỡ liên kết ${entityType.toLowerCase()} thất bại`)
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
    manageRelatedEntity,
    unlinkRelatedEntity,
  }
}
