import { AvatarDisplay } from '@/components/AvatarDisplay'
import { FullPageLoading } from '@/components/FullPageLoadingAndError'
import { useAuth } from '@/context/auth-context'
import { Aside } from '@/layout/studio'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { Menu, Pagination } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { FetchRes } from '@/types/fetch-res'
import { following } from '../Following'

export const FollingListForHome = () => {
  const { user } = useAuth()
  const client = useHttp()
  const {
    run: fetchMyFollowingUpdate,
    isLoading: isFetchingMyFollowingUpdate,
    data: myFollowingRes
  } = useAsync<
    FetchRes<{
      total: number
      followings: following[]
    }>
  >()
  const [current, setCurrent] = useState(1)
  const { run: fetchRemoveNewPostNotification } = useAsync<FetchRes<any[]>>()

  const removeNewPostNotification = (creatorId: number) => {
    fetchRemoveNewPostNotification(
      client(`user/removeNewPostNotification/${creatorId}`, { method: 'PATCH' })
    )
  }

  const getMyFollowingUpdate = ({
    current = 1,
    pageSize = 15
  }: {
    current?: number
    pageSize?: number
    total?: number
  }) => {
    if (!user) return
    fetchMyFollowingUpdate(
      client(`user/following`, { data: { page: current, limit: pageSize } })
    )
  }

  useEffect(() => {
    getMyFollowingUpdate({})
  }, [])

  if (myFollowingRes?.data.followings.length === 0) {
    return (
      <div
        style={{
          minWidth: '200px',
          textAlign: 'center',
          fontSize: '15px',
          fontWeight: 'bold',
          marginTop: '35px'
        }}
      >
        No Following Yet
      </div>
    )
  }

  return (
    <Aside>
      {isFetchingMyFollowingUpdate ? (
        <FullPageLoading />
      ) : (
        <>
          <Menu
            mode={'inline'}
            items={myFollowingRes?.data.followings.map((item) => {
              return {
                label: (
                  <Link
                    onClick={() => {
                      if (!item.followed.id) return
                      removeNewPostNotification(item.followed.id)
                    }}
                    to={`/creator/${item.followed.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex' }}>
                      <AvatarDisplay
                        avatarSrc={item.followed.userProfile.avatar}
                        style={{
                          width: '25px',
                          height: '25px',
                          borderRadius: '50%',
                          verticalAlign: 'middle',
                          marginRight: '5px'
                        }}
                      />
                      <div
                        style={{
                          width: '100px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.followed.username}
                      </div>
                      <div style={{ margin: 'auto' }}>
                        {item.followedHasNewPost && <NotificationDot />}
                      </div>
                    </div>
                  </Link>
                ),
                key: item.followed.username
              }
            })}
          />
          {myFollowingRes && myFollowingRes?.data.total > 20 && (
            <Pagination
              simple
              current={current}
              total={myFollowingRes?.data.total}
              pageSize={15}
              onChange={(current, pageSize) => {
                getMyFollowingUpdate({ current, pageSize })
                setCurrent(current)
              }}
              style={{ textAlign: 'center', marginTop: '5px' }}
            />
          )}
        </>
      )}
    </Aside>
  )
}

const NotificationDot = styled.div`
  margin: auto;
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
`
