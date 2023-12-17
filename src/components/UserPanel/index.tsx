import { Button, Popover } from 'antd'
import styled from '@emotion/styled'
import { useAuth } from '@/context/auth-context'
import { ReactElement } from 'react'
import { AvatarDisplay } from '../AvatarDisplay'

export const UserPanel = ({ options }: { options: ReactElement[] }) => {
  const { user, logout } = useAuth()
  const content = (
    <>
      {options.map((option, index) => (
        <p key={index}>
          <Button type="link">{option}</Button>
        </p>
      ))}
      <p>
        <Button type="link" onClick={() => logout()}>
          Logout
        </Button>
      </p>
    </>
  )

  return (
    <UserPanelWrapper>
      <Popover content={content}>
        <AvatarDisplay
          avatarSrc={user?.userProfile.avatar}
          style={{
            width: '35px',
            height: '35px',
            margin: 'auto 20px',
            borderRadius: '50%',
            verticalAlign: 'middle',
          }}
        />
      </Popover>
    </UserPanelWrapper>
  )
}

const UserPanelWrapper = styled.div`
  text-align: right;
`
