/**
 * Global TypeScript Types
 */

// User types
export interface User {
  id: string
  email: string
  fullName: string | null
  role: 'user' | 'admin' | 'super_admin'
  isActive: boolean
  isVerified: boolean
  avatarUrl: string | null
  preferences: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

// Card types
export type CardType = 'text' | 'checklist' | 'image' | 'link' | 'code' | 'quote'
export type CardStatus = 'active' | 'archived' | 'deleted'

export interface CardBase {
  id: string
  title: string
  cardType: CardType
  status: CardStatus
  position: number
  ownerId: string
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export interface TextCardContent {
  text: string
  format: 'markdown' | 'plain' | 'html'
}

export interface ChecklistItem {
  text: string
  checked: boolean
}

export interface ChecklistCardContent {
  items: ChecklistItem[]
}

export interface ImageCardContent {
  url: string
  caption?: string
  altText?: string
}

export interface LinkCardContent {
  url: string
  title?: string
  description?: string
  thumbnailUrl?: string
}

export interface CodeCardContent {
  code: string
  language: string
}

// Card with specific content types
export interface TextCard extends CardBase {
  cardType: 'text'
  content: TextCardContent
}

export interface ChecklistCard extends CardBase {
  cardType: 'checklist'
  content: ChecklistCardContent
}

export interface ImageCard extends CardBase {
  cardType: 'image'
  content: ImageCardContent
}

export interface LinkCard extends CardBase {
  cardType: 'link'
  content: LinkCardContent
}

export interface CodeCard extends CardBase {
  cardType: 'code'
  content: CodeCardContent
}

export type Card = TextCard | ChecklistCard | ImageCard | LinkCard | CodeCard

// Tag types
export interface Tag {
  id: string
  name: string
  color: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

// Auth types
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  fullName?: string
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  status: number
  detail?: string
}
