/**
 * Global TypeScript Types
 * Aligned with the new DB schema (profiles, templates, creations, subscription_policies)
 */

// =============================================================================
// Profile / User
// =============================================================================

export type SubscriptionTier = 'free' | 'premium'

export interface SubscriptionInfo {
  tier: SubscriptionTier
  creations_count_free: number
  creations_count_pro: number
  additional_creation_free: number
  additional_creation_pro: number
  premium_start: string | null
  premium_expiry: string | null
  is_active: boolean
}

export interface ProfileData {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  date_of_birth: string | null
  avatar_url: string | null
  created_at: string | null
  updated_at: string | null
  subscription: SubscriptionInfo
}

export interface ProfileUpdateData {
  first_name?: string
  last_name?: string
  date_of_birth?: string
  avatar_url?: string
}

// =============================================================================
// Templates
// =============================================================================

export interface Template {
  id: string
  slug: string
  name: string
  category: string[] | null
  tags: string | null
  is_premium: boolean
  config_schema: Record<string, unknown>
  is_active: boolean
  expiration_policy: Record<string, unknown> | null
}

// =============================================================================
// Creations (replaces old Pages / Cards)
// =============================================================================

export interface CreateCreationRequest {
  template_id: string
  metadata: Record<string, unknown>
}

export interface CreateCreationResponse {
  id: string
  expires_at: string | null
}

export interface CreationListItem {
  id: string
  template_slug: string
  template_name: string
  is_paid: boolean | null
  expires_at: string | null
  is_deleted: boolean
  created_at: string
}

export interface CreationDetail {
  id: string
  template_slug: string
  template_name: string
  metadata: Record<string, unknown>
  is_paid: boolean | null
  expires_at: string | null
  created_at: string
}

// =============================================================================
// Dashboard
// =============================================================================

export interface DashboardStats {
  creations_count_free: number
  creations_count_pro: number
  additional_creation_free: number
  additional_creation_pro: number
  subscription_tier: string
}

export interface DashboardCreation {
  id: string
  template_slug: string
  template_name: string
  created_at: string
  expires_at: string | null
  is_expired: boolean
  is_paid: boolean | null
  is_deleted: boolean
}

export interface DashboardData {
  stats: DashboardStats
  creations: DashboardCreation[]
}

// =============================================================================
// Auth
// =============================================================================

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

// =============================================================================
// API
// =============================================================================

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
