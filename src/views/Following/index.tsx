import { Card, Table } from 'antd'
import { StudioContainer } from '../Dashboard'
import { useHttp } from '@/utils/use-http'
import { User } from '@/types/user'
import { useAsync } from '@/utils/use-async'
import { useEffect } from 'react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { FetchRes } from '@/types/fetch-res'
import { CreatorName } from '@/components/CreatorName'

export interface following {
  id: number
  followedAt: Date
  followed: User
  followedHasNewPost?: Date | null
}

export const Following = () => {
  const client = useHttp()
  const {
    run: fetchMyFollowings,
    isLoading: isFetchingMyFollowings,
    data: myFollowings
  } = useAsync<
    FetchRes<{
      total: number
      followings: following[]
    }>
  >()

  const getMyFollowings = ({
    current = 1,
    pageSize = 10
  }: {
    current?: number
    pageSize?: number
    total?: number
  }) => {
    fetchMyFollowings(
      client(`user/following`, { data: { page: current, limit: pageSize } })
    )
  }

  useEffect(() => {
    getMyFollowings({})
  }, [])

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'followed.userProfile.avatar',
      key: 'avatar',
      width: '75px',
      render: (_: any, record: any) => {
        return (
          <AvatarDisplay
            avatarSrc={record.followed.userProfile.avatar}
            toCreatorHome={record.followed.id}
            style={{
              verticalAlign: 'middle',
              width: '35px',
              height: '35px',
              borderRadius: '50%'
            }}
          />
        )
      }
    },
    {
      title: 'Name',
      dataIndex: 'followed.username',
      key: 'username',
      render: (_: any, record: any) => {
        return (
          <CreatorName toCreatorHome={record.followed.id}>
            {record.followed.username}
          </CreatorName>
        )
      }
    },
    {
      title: 'Has new posts?',
      dataIndex: 'followedHasNewPost',
      key: 'followedHasNewPost',
      render: (_: any, record: any) =>
        record.followedHasNewPost ? 'true' : 'false'
    }
  ]

  const followings = myFollowings?.data?.followings.map((item) => ({
    ...item,
    key: item.id
  }))
  return (
    <StudioContainer>
      <h2>Following</h2>
      <Card>
        <Table
          loading={isFetchingMyFollowings}
          columns={columns}
          dataSource={followings}
          pagination={{ total: myFollowings?.data.total }}
          onChange={getMyFollowings}
        />
      </Card>
    </StudioContainer>
  )
}
