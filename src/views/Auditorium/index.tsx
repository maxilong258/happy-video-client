import { Post } from '@/types/post'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { Card, Col, Image, Row, Space } from 'antd'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { VideoPlayer } from '@/components/VideoPlayer'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { Comments } from './Comments'
import { VidoeTitle } from '@/components/PostCard'
import { useAuth } from '@/context/auth-context'
import { SubscribeButton } from '@/components/SubscribeButton'
import { SavePostBtn } from './SavePostBtn'
import { LikePostButton } from './LikePostBtn'
import { FullPageSkeleton } from '../../components/FullPageSkeleton'
import { CreatorName } from '@/components/CreatorName'
import { FetchRes } from '@/types/fetch-res'

export const Auditorium = () => {
  const { id: postId } = useParams()
  const { user } = useAuth()
  const client = useHttp()
  const {
    run: fetchPostInfo,
    isLoading: isFetching,
    data: postInfoRes,
    setData
  } = useAsync<FetchRes<Post>>()
  const { run: addViews } = useAsync<FetchRes<Post>>()

  useEffect(() => {
    fetchPostInfo(client(`posts/${postId}`, { data: { userId: user?.id } }))
    addViews(client(`posts/views/${postId}`, { method: 'PATCH' }))
  }, [])

  const postInfo = postInfoRes?.data
  return (
    <Row style={{ marginTop: '20px' }}>
      <Col flex="2" />
      <Col flex="14">
        {!postInfo ? (
          <FullPageSkeleton hasAvatar={true} />
        ) : (
          <Card
            bordered={false}
            loading={isFetching}
            style={{ marginRight: '10px', boxShadow: '0px 0px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ width: '100%' }}>
                {postInfo.type === 'video' ? (
                  <VideoPlayer src={postInfo?.source} />
                ) : (
                  <Image width={'100%'} src={postInfo?.source} />
                )}
                <VidoeTitle style={{ margin: '20px 0' }}>
                  {postInfo?.title}
                </VidoeTitle>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AvatarDisplay
                  avatarSrc={postInfo?.user.userProfile.avatar}
                  toCreatorHome={postInfo?.user.id}
                  style={{
                    verticalAlign: 'middle',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%'
                  }}
                />
                <div style={{ margin: 'auto 10px' }}>
                  <CreatorName
                    style={{
                      display: 'inline',
                      fontSize: '15px',
                      fontWeight: 'bold'
                    }}
                    toCreatorHome={postInfo.user.id}
                  >
                    {postInfo.user.username}
                  </CreatorName>
                  <div>{postInfo.user.userProfile.subscribers} subscribers</div>
                </div>

                <SubscribeButton
                  userId={user?.id}
                  creatorId={postInfo.user.id}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  {`${postInfo?.views} views |`} {`${postInfo?.likes} likes |`}{' '}
                  {`${new Date(postInfo?.createTime).toLocaleString()}`}
                </div>
                <Space>
                  <LikePostButton postInfoRes={postInfoRes} setData={setData} />
                  <SavePostBtn postInfoRes={postInfoRes} setData={setData} />
                </Space>
              </div>

              <div>
                <p style={{ whiteSpace: 'pre-line' }}>{postInfo?.introduct}</p>
              </div>
            </Space>
          </Card>
        )}
      </Col>
      <Col flex="6">
        <Comments postId={Number(postId)} />
      </Col>
      <Col flex="2" />
    </Row>
  )
}
