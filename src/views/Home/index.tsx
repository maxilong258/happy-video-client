import { Post } from '@/types/post'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { useEffect, useState } from 'react'
import { PostCard } from '@/components/PostCard'
import { FollingListForHome } from './FollowingListForHome'
import { FetchRes } from '@/types/fetch-res'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FullPageSkeleton } from '@/components/FullPageSkeleton'

export const Home = () => {
  const client = useHttp()
  const { run: fetchVideoList } = useAsync<FetchRes<Post[]>>()

  const [postListInfo, setPostListInfo] = useState<{
    currPage: number
    pageSize: number
    hasMore: boolean
    data: Post[]
  }>({
    currPage: 1,
    pageSize: 30,
    hasMore: true,
    data: []
  })

  const getVideoList = async () => {
    if (!postListInfo.hasMore) return
    const res = await fetchVideoList(
      client('posts', {
        data: { page: postListInfo.currPage, limit: postListInfo.pageSize }
      })
    )
    setPostListInfo((prev) => ({
      currPage: prev.currPage + 1,
      pageSize: prev.pageSize,
      hasMore: res.data.length === prev.pageSize,
      data: [...prev.data, ...res.data]
    }))
  }

  useEffect(() => {
    getVideoList()
  }, [])

  const postList = postListInfo.data

  return (
    <div style={{ display: 'flex' }}>
      <FollingListForHome />
      <InfiniteScroll
        height={'92vh'}
        style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}
        dataLength={postListInfo.pageSize}
        next={() => {
          getVideoList()
        }}
        hasMore={postListInfo.hasMore}
        loader={<FullPageSkeleton />}
      >
        {postList?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  )
}