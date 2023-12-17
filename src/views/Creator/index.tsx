import { useParams } from 'react-router'
import { Hero } from './Hero'
import { useHttp } from '@/utils/use-http'
import { useAsync } from '@/utils/use-async'
import { Post } from '@/types/post'
import { useEffect, useState } from 'react'
import { PostCard } from '@/components/PostCard'
import { Card, Col, Row } from 'antd'
import { User } from '@/types/user'
import { FetchRes } from '@/types/fetch-res'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FullPageSkeleton } from '@/components/FullPageSkeleton'

export const Creator = () => {
  const { id: creatorId } = useParams()

  const client = useHttp()
  const { run: fetchCreatorPosts } = useAsync<FetchRes<Post[]>>()
  const {
    run: fetchUserProfile,
    isLoading: isFetchingUserProfile,
    data: userInfoRes
  } = useAsync<FetchRes<User>>()

  const [creatorPostsInfo, setCreatorPostsInfo] = useState<{
    hasMore: boolean
    currPage: number
    pageSize: number
    data: Post[]
  }>({
    hasMore: true,
    currPage: 1,
    pageSize: 20,
    data: []
  })

  const getCreatorPosts = async () => {
    if (!creatorPostsInfo.hasMore) return
    const res = await fetchCreatorPosts(
      client(`posts/user/${creatorId}`, {
        data: {
          page: creatorPostsInfo.currPage,
          limit: creatorPostsInfo.pageSize
        }
      })
    )
    setCreatorPostsInfo((prev) => ({
      ...prev,
      hasMore: res.data.length === prev.pageSize,
      currPage: prev.currPage + 1,
      data: [...prev.data, ...res.data]
    }))
  }

  useEffect(() => {
    fetchUserProfile(client(`user/getCreatorProfile/${creatorId}`, {}))
    getCreatorPosts()
  }, [])

  const userInfo = userInfoRes?.data
  const creatorPosts = creatorPostsInfo.data
  return (
    <>
      <Hero userInfo={userInfo} loading={isFetchingUserProfile} />
      <Row>
        <Col span={2}></Col>
        <Col span={15}>
          <Card bordered={false} style={{ boxShadow: '0px 0px' }}>
            <InfiniteScroll
              height={'60vh'}
              dataLength={creatorPostsInfo.pageSize}
              style={{ display: 'flex', flexWrap: 'wrap' }}
              next={() => {
                getCreatorPosts()
              }}
              hasMore={creatorPostsInfo.hasMore}
              loader={<FullPageSkeleton />}
            >
              {creatorPosts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </InfiniteScroll>
          </Card>
        </Col>
        <Col span={5}>
          <Card
            bordered={false}
            style={{ whiteSpace: 'pre-line', boxShadow: '0px 0px' }}
          >
            {userInfo?.userProfile.introduction}
          </Card>
        </Col>
        <Col span={2}></Col>
      </Row>
    </>
  )
}
