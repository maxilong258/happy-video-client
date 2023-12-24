import { ReactNode, useEffect } from "react"
import * as auth from '@/utils/auth-provider'
import { useAsync } from "@/utils/use-async"
import { User } from "@/types/user"
import React from "react"
import { http } from "@/utils/use-http"
import { FullPageErrorFallback, FullPageLoading } from "@/components/FullPageLoadingAndError"

interface AuthForm {
  username?: string,
  email: string
  password: string
}

const bootstrapUser = async () => {
  let user = null
  const token = auth.getToken()
  if (token) {
    const res = await http('auth/me', {token})
    user = res.data
  }
  return user 
}

const AuthContext = React.createContext<{
  user: User | null
  register: (form: AuthForm) => Promise<User | undefined>
  login: (form: AuthForm) => Promise<User | undefined>
  logout: () => Promise<void>
} | undefined>(undefined)
AuthContext.displayName = 'AuthContext'

export const AuthProvider = ({children}: {children: ReactNode}) => {

  const {data: user, error, isLoading, isIdle, isError, run, setData: setUser} = useAsync<User | null>()

  const login = (form: AuthForm) => auth.login(form).then((user) => {setUser(user ?? null); return user})
  const register = (form: AuthForm) => auth.register(form).then((user) => {setUser(user ?? null); return user})
  const logout = () => auth.logout().then(() => {
    setUser(null)
  })

  useEffect(() => {
    run(bootstrapUser())
  }, [])

  if (isIdle || isLoading) {
    return <FullPageLoading />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  return (
    <AuthContext.Provider children={children} value={{user, login, register, logout}}/>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error('useAuth必须在AuthProvider中使用')
  return context
}