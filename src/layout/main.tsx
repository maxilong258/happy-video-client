import { Outlet } from 'react-router-dom'
import styled from '@emotion/styled'
import { AppHeader } from '@/components/AppHeader'

export const MainLayout = () => {
  return (
    <>
      <>
        <AppHeader page={'main'} />
        <Main>
          <Outlet />
        </Main>
      </>
    </>
  )
}

const Main = styled.div`
  padding: 10px;
  width: 100%;
`
