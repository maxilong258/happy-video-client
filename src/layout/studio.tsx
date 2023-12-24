import { useAuth } from '@/context/auth-context'
import { Link, Outlet, useLocation } from 'react-router-dom'
import styled from '@emotion/styled'
import { UnAuthenticatedApp } from '@/views/UnAuthenticatedApp'
import { Menu, MenuProps } from 'antd'
import { routes } from '@/routes'
import { AppHeader } from '@/components/AppHeader'

const useRouteType = () => {
  const units = useLocation().pathname.split('/')
  return units[units.length - 1]
}

export const StudioLayout = () => {
  const { user } = useAuth()
  const routeType = useRouteType()
  const AsideMenus = routes.find((route) => route.name === 'studio')?.children
  const AsideItems: MenuProps['items'] = AsideMenus?.map((menu) => ({
    label: <Link to={menu.path}>{menu.name}</Link>,
    key: menu.routeName
  }))

  return (
    <>
      {!user ? (
        <UnAuthenticatedApp />
      ) : (
        <>
        <AppHeader page={'studio'} />
          <div style={{display: 'flex'}}>
            <Aside>
              <Menu
                mode={'inline'}
                selectedKeys={[routeType]}
                items={AsideItems}
              />
            </Aside>
            <Main>
              <Outlet />
            </Main>
          </div>
        </>
      )}
    </>
  )
}

const Main = styled.div`
  padding: 10px;
  width: 100%;
`

export const Aside = styled.aside`
  /* background-color: rgb(244, 245, 247); */
  min-width: 200px;
  display: flex;
  flex-direction: column;
`
