import { useAuth } from '@/context/auth-context'
import { useCallback } from 'react'
import QueryString from 'qs'
import { showErrorTips } from '@/components/FetchErrorTips'
import { logout } from './auth-provider'

const baseUrl = import.meta.env.VITE_BASE_URL

interface Config extends RequestInit {
  data?: object
  token?: string
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config
) => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': data ? 'application/json' : ''
    },
    ...customConfig
  }

  if (config.method.toUpperCase() === 'GET')
    endpoint += `?${QueryString.stringify(data)}`
  else config.body = JSON.stringify(data || {})

  return fetch(`${baseUrl}/${endpoint}`, config).then(async (response) => {
    if (response.status === 401) {
      await logout()
      window.location.reload()
      return Promise.reject({ message: 'Please Login' })
    }
    const res = await response.json()
    if (!response.ok) {
      showErrorTips(res)
    }
    return res
  })
}

export const useHttp = () => {
  const { user } = useAuth()
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token]
  )
}
