import styled from '@emotion/styled'
import { UserPanel } from '../UserPanel'
import { Link } from 'react-router-dom'
import { SearchPanel } from '../SearchPanel/SearchPanel'

export const AppHeader = ({ page }: { page: string }) => {
  return (
    <Header>
      <MainPanel>
        <Link style={{ textDecoration: 'none' }} to={'/'}>
          Happy video
        </Link>
      </MainPanel>
      <SearchPanel />
      <UserPanel page={page} />
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  height: 56px;
  line-height: 56px;
  align-items: center;
`
const MainPanel = styled.div`
  /* flex: 1; */
  padding: 0 28px;
  font-size: 20px;
  font-weight: bold;
  color: #00afc0;
  text-shadow: 0px 0px 3px #00afc0,
`
