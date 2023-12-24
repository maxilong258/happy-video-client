import { UnAuthenticatedApp } from '.'

export const AuthPage = () => {
  return <>
    <UnAuthenticatedApp isNeedRedirectToHome={true} />
  </>
}
