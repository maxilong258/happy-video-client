import { Button, Card, Popconfirm, message } from 'antd'
import { StudioContainer } from '../Dashboard'
import { useHttp } from '@/utils/use-http'
import { Post } from '@/types/post'
import { useAsync } from '@/utils/use-async'
import { useEffect, useState } from 'react'
import { PostCard } from '@/components/PostCard'
import { FetchRes } from '@/types/fetch-res'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FullPageSkeleton } from '@/components/FullPageSkeleton'

export const Collection = () => {
  const client = useHttp()
  const { run: fetchMyCollection } =
    useAsync<FetchRes<{ id: number; post: Post; saveAt: Date }[]>>()

  const {
    run: fetchRemoveFromCollection,
    isLoading: isFetchingRemoveFromCollection
  } = useAsync<FetchRes<{ id: number; post: Post; saveAt: Date }[]>>()

  const [collectionInfo, setCollectionInfo] = useState({
    hasMore: true,
    currPage: 1,
    pageSize: 30,
    data: [] as { id: number; post: Post; saveAt: Date }[]
  })

  const removeFromCollection = async (postId: number) => {
    const res = await fetchRemoveFromCollection(
      client(`user/collect`, { method: 'POST', data: { postId } })
    )
    if (res.success) {
      message.success('Remove from collection successfully')
      collectionList.forEach((collection, index) => {
        if (collection.post.id === postId) {
          collectionList.splice(index, 1)
        }
      })
    }
  }

  const getMyCollection = async () => {
    const res = await fetchMyCollection(
      client('user/collect', {
        data: {
          page: collectionInfo.currPage,
          limit: collectionInfo.pageSize
        }
      })
    )
    if (!res.success) return
    setCollectionInfo((prev) => ({
      ...prev,
      hasMore: prev.pageSize === res.data.length,
      currPage: prev.currPage + 1,
      data: [...prev.data, ...res.data]
    }))
  }

  useEffect(() => {
    getMyCollection()
  }, [])

  const collectionList = collectionInfo.data

  return (
    <StudioContainer>
      <h2>Saved</h2>
      <Card>
        <InfiniteScroll
          // height={'86vh'}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            maxHeight: '86vh'
          }}
          dataLength={collectionInfo.pageSize}
          next={() => {
            getMyCollection()
          }}
          hasMore={collectionInfo.hasMore}
          loader={<FullPageSkeleton />}
        >
          {collectionList.map((collection) => (
            <div key={collection.id}>
              <PostCard key={collection.post.id} post={collection.post} />
              <div style={{ width: '100%', textAlign: 'center' }}>
                SaveAt {new Date(collection.saveAt).toLocaleString()}
                <Popconfirm
                  title="Cancel save this post?"
                  onConfirm={() => {
                    removeFromCollection(collection.post.id)
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" loading={isFetchingRemoveFromCollection}>
                    Cancel save
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </Card>
    </StudioContainer>
  )
}
