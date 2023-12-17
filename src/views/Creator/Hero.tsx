import { AvatarDisplay } from '@/components/AvatarDisplay'
import { FullPageLoading } from '@/components/FullPageLoadingAndError'
import { SubscribeButton } from '@/components/SubscribeButton'
import { useAuth } from '@/context/auth-context'
import { User } from '@/types/user'
import { Space } from 'antd'
import backgroundImage from '@/assets/default-background.jpg'

export const Hero = ({
  userInfo,
  loading
}: {
  userInfo?: User
  loading: boolean
}) => {
  const { user } = useAuth()
  return (
    <div
      style={{
        width: '100%',
        ...(userInfo?.userProfile.background
          ? { backgroundImage: `url(${userInfo?.userProfile.background})` }
          : { backgroundImage: `url(${backgroundImage})` }),
        backgroundSize: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {loading ? (
        <FullPageLoading />
      ) : (
        <div
          style={{
            display: 'flex',
            paddingTop: '17vh',
            width: '78%',
            margin: '0 auto',
            paddingBottom: '50px'
          }}
        >
          <AvatarDisplay
            avatarSrc={userInfo?.userProfile.avatar}
            style={{
              borderRadius: '50%',
              width: '150px',
              height: '150px',
              marginRight: '30px'
            }}
          />
          <Space direction={'vertical'} style={{ fontSize: '14px' }}>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              {userInfo?.username}
            </div>
            <div>
              <Space size={35}>
                {userInfo?.email}
                {`${userInfo?.userProfile.subscribers} subscribers`}
              </Space>
            </div>
            <div>
              <Space size={35}>
                {userInfo?.userProfile.country}
                {userInfo?.userProfile.birthday}
              </Space>
            </div>
            <div
              style={{
                whiteSpace: 'pre-line',
                height: '18px',
                overflow: 'hidden'
              }}
            >
              {userInfo?.userProfile.introduction}
            </div>
            <div>
              <SubscribeButton userId={user?.id} creatorId={userInfo?.id} />
            </div>
          </Space>
        </div>
      )}
    </div>
  )
}
