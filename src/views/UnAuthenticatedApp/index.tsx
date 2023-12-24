import { useState } from 'react'
import { Login } from './Login'
import { Register } from './Register'

export const UnAuthenticatedApp = ({isNeedRedirectToHome = false} : {isNeedRedirectToHome?: boolean}) => {
  const [isRegister, setIsRegister] = useState(false)
  return (
    <>
      {isRegister}
      {isRegister ? (
        <Register setIsRegister={setIsRegister} isNeedRedirectToHome={isNeedRedirectToHome} />
      ) : (
        <Login setIsRegister={setIsRegister} isNeedRedirectToHome={isNeedRedirectToHome} />
      )}
    </>
  )
}
