export interface User {
  id: string
  email: string
  password: string
  roleId: number
  role: Role
  createdAt: Date
  updatedAt: Date
  refreshToken: RefreshToken[]
}

export interface Role {
  id: number
  name: string
  users: User[]
}

export interface Article {
  id: string
  title: string
  description: string
  content: string
  type: string
  createdAt: Date
  viewCount: number
  status: string
  coverImage?: string
  backgroundImage?: string
  slug: string
  tagId: string
  tag: Tag
  translations: ArticleTranslation[]
}

export interface ArticleTranslation {
  id: string
  articleId: string
  language: string
  title: string
  content: string
  createdAt: Date
  article: Article
}

export interface Tag {
  id: string
  name: string
  parentId?: string
  createdAt: Date
  parent?: Tag
  children: Tag[]
  articles: Article[]
}

export interface RefreshToken {
  id: string
  token: string
  userId: string
  user: User
  createdAt: Date
  expiresAt: Date
}
