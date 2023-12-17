import { useAuth } from '@/context/auth-context'
import { Link, Outlet } from 'react-router-dom'
import styled from '@emotion/styled'
import { UnAuthenticatedApp } from '@/views/UnAuthenticatedApp'
import { AppHeader } from '@/components/AppHeader'

export const MainLayout = () => {
  const { user } = useAuth()

  return (
    <>
      {!user ? (
        <UnAuthenticatedApp />
      ) : (
        <>
          <AppHeader
            options={[
              <Link to={`/creator/${user.id}`}>Your creator home</Link>,
              <Link to={'/studio/dashboard'}>Your channel</Link>,
            ]}
          />
          <Main>
            <Outlet />
          </Main>
        </>
      )}
    </>
  )
}

const Main = styled.div`
  padding: 10px;
  width: 100%;
`
