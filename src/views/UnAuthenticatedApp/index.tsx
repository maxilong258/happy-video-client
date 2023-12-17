import { useState } from 'react'
import { Login } from './Login'
import { Register } from './Register'

export const UnAuthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(false)
  return (
    <>
      {isRegister}
      {isRegister ? (
        <Register setIsRegister={setIsRegister} />
      ) : (
        <Login setIsRegister={setIsRegister} />
      )}
    </>
  )
}
