'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import api, { setTokens, clearTokens } from '@/lib/api'
import { User, LoginCredentials, AuthTokens } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await api.post<AuthTokens>('/auth/login', credentials)
      setTokens(data.accessToken, data.refreshToken)
      
      const { data: userData } = await api.get<User>('/users/me')
      setUser(userData)
      router.push('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
    router.push('/login')
  }, [router])

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get<User>('/users/me')
      setUser(data)
    } catch {
      logout()
    }
  }, [logout])

  return { user, login, logout, fetchUser, isLoading, error }
}
