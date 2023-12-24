import { Button, Popover } from 'antd'
import styled from '@emotion/styled'
import { useAuth } from '@/context/auth-context'
import { AvatarDisplay } from '../AvatarDisplay'
import { Link, useNavigate } from 'react-router-dom'

export const UserPanel = ({ page }: { page: string }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const content = !user ? (
    <></>
  ) : (
    <>
      {page === 'main' && (
        <>
          {/* main */}
          <p>
            <Link to={`/creator/${user.id}`}>
              <Button type="link">Your creator home</Button>
            </Link>
          </p>
          <p>
            <Link to={'/studio/dashboard'}>
              <Button type="link">Your channel</Button>
            </Link>
          </p>
        </>
      )}
      {page === 'studio' && (
        <Link to={'/'}>
          <Button type="link">main site</Button>
        </Link>
      )}
      <p>
        <Button
          type="link"
          onClick={async () => {
            await logout()
            navigate('/auth')
          }}
        >
          Log out
        </Button>
      </p>
    </>
  )

  return (
    <UserPanelWrapper>
      {!user ? (
        <Link to={'/auth'}>
          <Button shape="round" style={{ margin: '0 20px' }}>
            Login
          </Button>
        </Link>
      ) : (
        <Popover content={content}>
          <AvatarDisplay
            avatarSrc={user.userProfile.avatar}
            style={{
              width: '35px',
              height: '35px',
              margin: 'auto 20px',
              borderRadius: '50%',
              verticalAlign: 'middle'
            }}
          />
        </Popover>
      )}
    </UserPanelWrapper>
  )
}

const UserPanelWrapper = styled.div`
  text-align: right;
`
