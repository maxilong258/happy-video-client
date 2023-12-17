import { AvatarDisplay } from '@/components/AvatarDisplay'
import { CreatorName } from '@/components/CreatorName'
import { FetchRes } from '@/types/fetch-res'
import { Post } from '@/types/post'
import { User } from '@/types/user'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { Card } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PostCard } from '@/components/PostCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FullPageSkeleton } from '@/components/FullPageSkeleton'

export const SearchResult = () => {
  const { keyword: keyword } = useParams()

  const client = useHttp()
  const {
    run: fetchUserResult,
    isLoading: isFetchingUserResult,
    data: userSearchRes
  } = useAsync<FetchRes<User[]>>()

  const { run: fetchPostResult } = useAsync<FetchRes<Post[]>>()

  const defaultPostSearchInfo = {
    hasMore: true,
    currPage: 1,
    pageSize: 30,
    data: [] as Post[]
  }
  const [postSearchInfo, setPostSearchInfo] = useState(defaultPostSearchInfo)

  const getPostResult = async (page?: number) => {
    const res = await fetchPostResult(
      client('posts', {
        data: {
          title: keyword,
          page: page || postSearchInfo.currPage,
          limit: postSearchInfo.pageSize
        }
      })
    )
    if (!res.success) return
    setPostSearchInfo((prev) => ({
      ...prev,
      hasMore: res.data.length === prev.pageSize,
      currPage: prev.currPage + 1,
      data: [...prev.data, ...res.data]
    }))
  }

  useEffect(() => {
    setPostSearchInfo(defaultPostSearchInfo)
    fetchUserResult(client('user', { data: { username: keyword } }))
    getPostResult(1)
  }, [keyword])

  const users = userSearchRes?.data
  const posts = postSearchInfo?.data
  return (
    <>
      {users?.length === 0 && posts?.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>
          <div>No result found</div>
        </div>
      )}
      {users?.length !== 0 && (
        <Card
          bordered={false}
          loading={isFetchingUserResult}
          style={{ boxShadow: '0px 0px' }}
        >
          {users?.map((user) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                border: '1px solid #eee',
                borderRadius: '8px'
              }}
            >
              <AvatarDisplay
                avatarSrc={user.userProfile.avatar}
                style={{
                  width: '75px',
                  height: '75px',
                  borderRadius: '50%',
                  verticalAlign: 'middle',
                  marginRight: '20px'
                }}
                toCreatorHome={user.id}
              />
              <div>
                <CreatorName
                  style={{ fontSize: '18px', fontWeight: 'bold' }}
                  toCreatorHome={user.id}
                >
                  {user.username}
                </CreatorName>
                <div>{user.userProfile.subscribers} subscribers</div>
                <div>{user.userProfile.introduction.split('/n')[0]}</div>
              </div>
            </div>
          ))}
        </Card>
      )}
      {posts?.length !== 0 && (
        <InfiniteScroll
          height={users?.length === 0 ? '88vh' : '64vh'}
          style={{ display: 'flex', flexWrap: 'wrap', padding: '6px' }}
          dataLength={postSearchInfo.pageSize}
          next={() => {
            getPostResult()
          }}
          hasMore={postSearchInfo.hasMore}
          loader={<FullPageSkeleton />}
        >
          {posts?.map((post) => (
            <PostCard post={post} />
          ))}
     
         
        </InfiniteScroll>
      )}
    </>
  )
}
