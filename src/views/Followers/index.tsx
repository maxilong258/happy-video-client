import { Card, Table } from 'antd'
import { StudioContainer } from '../Dashboard'
import { useHttp } from '@/utils/use-http'
import { User } from '@/types/user'
import { useAsync } from '@/utils/use-async'
import { useEffect } from 'react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { Link } from 'react-router-dom'
import { FetchRes } from '@/types/fetch-res'

export const Followers = () => {
  const client = useHttp()
  const {
    run: fetchMyFollowers,
    isLoading: isFetchingMyFollowers,
    data: myFollowers
  } = useAsync<
    FetchRes<{
      total: number
      followers: { id: number; followedAt: Date; follower: User }[]
    }>
  >()

  const getMyFollowers = ({current = 1, pageSize = 10}: {
    current?: number
    pageSize?: number
    total?: number
  }) => {
    fetchMyFollowers(client(`user/followers`, {data: {page: current, limit: pageSize}}))
  }

  useEffect(() => {
    getMyFollowers({})
  }, [])

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'userProfile.avatar',
      key: 'avatar',
      width: '75px',
      render: (avatar: string, record: User) => {
        return (
          <AvatarDisplay
            avatarSrc={avatar}
            toCreatorHome={record.id}
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
      dataIndex: 'username',
      key: 'username',
      render: (username: string, record: User) => {
        return <Link to={`/creator/${record.id}`}>{username}</Link>
      }
    }
  ]

  const followers = myFollowers?.data.followers.map((item) => ({
    ...item.follower,
    key: item.follower.id
  }))
  return (
    <StudioContainer>
      <h2>Followers</h2>
      <Card>
        <Table
          loading={isFetchingMyFollowers}
          columns={columns}
          dataSource={followers}
          pagination={{total: myFollowers?.data.total}}
          onChange={getMyFollowers}
        />
      </Card>
    </StudioContainer>
  )
}
