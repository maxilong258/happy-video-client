import { User } from '@/types/user'
import { http } from './use-http'

const localStorageKey = '__auth_provider_token__'

export const getToken = () => localStorage.getItem(localStorageKey)

export const handleUserResponse = (user: User) => {
  localStorage.setItem(localStorageKey, user.token || '')
  return user
}

export const login = async (data: { email: string; password: string }) => {
  const res = await http('auth/signin', {
    method: 'POST',
    data
  })
  if (!res.success) return
  return handleUserResponse(res.data)
}

export const register = async (data: {
  username?: string
  email: string
  password: string
}) => {
  const res = await http('auth/signup', {
    method: 'POST',
    data
  })
  if (!res.success) return
  return handleUserResponse(res.data)
}

export const logout = async () => localStorage.removeItem(localStorageKey)
