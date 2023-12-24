import { AvatarDisplay } from '@/components/AvatarDisplay'
import { User } from '@/types/user'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { LikeOutlined } from '@ant-design/icons'
import { Button, Card, Input, message } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { optimisticUpdate } from '@/utils/optimistic-update'
import { useAuth } from '@/context/auth-context'
import { FullPageSkeleton } from '../../components/FullPageSkeleton'
import { CreatorName } from '@/components/CreatorName'
import { FetchRes } from '@/types/fetch-res'
const { TextArea } = Input

interface Comment {
  id: number
  content: string
  createTime: Date
  likes: number
  user: Partial<User>
  isLiked: boolean
}

export const Comments = ({ postId }: { postId: number }) => {
  const { user } = useAuth()
  const [comment, setComment] = useState('')
  const [commentsInfo, setcommentsInfo] = useState({
    hasMore: true,
    pageNum: 1,
    pageSize: 20,
    total: 0,
    data: [] as Comment[]
  })

  const client = useHttp()

  const { run: fetchComments } =
    useAsync<FetchRes<{ comments: Comment[]; total: number }>>()

  const { run: addComment, isLoading: isAddingComment } =
    useAsync<FetchRes<Comment[]>>()

  const { run: LikeComment } = useAsync<FetchRes<any>>()

  const submitComment = async () => {
    const res = await addComment(
      client('comments', { method: 'POST', data: { content: comment, postId } })
    )
    if (!res.success) return
    setComment('')
    setcommentsInfo({
      ...commentsInfo,
      pageNum: 1
    })
    getComments(true)
    message.success('Comment successfully')
  }

  const handleClickLike = (commentId: number) => {
    return async () => {
      if (!user) {
        message.info('Please Login first')
        return
      }
      const [newTemp, reset] = optimisticUpdate(commentsInfo, (temp) => {
        const data = temp.data.map((item) => {
          if (item.id === commentId) {
            item.isLiked = !item.isLiked
            item.likes += item.isLiked ? 1 : -1
          }
          return item
        })
        return { ...commentsInfo, data }
      })
      setcommentsInfo(newTemp)
      const res = await LikeComment(
        client(`comments/like/${commentId}`, { method: 'PATCH' })
      )
      if (!res.success) {
        setcommentsInfo(reset())
        return message.error('Like failed')
      }
    }
  }

  const getComments = async (isAfterAddComment?: boolean) => {
    if (!isAfterAddComment && !commentsInfo.hasMore) return
    const res = await fetchComments(
      client(`comments/post/${postId}`, {
        data: {
          userId: user?.id,
          page: isAfterAddComment ? 1 : commentsInfo.pageNum,
          limit: commentsInfo.pageSize
        }
      })
    )
    if (!res.success) return
    setcommentsInfo((prev) => ({
      ...prev,
      hasMore: res.data.comments.length === prev.pageSize,
      pageNum: isAfterAddComment ? 1 : prev.pageNum + 1,
      data: isAfterAddComment
        ? res.data.comments
        : prev.data.concat(res.data.comments)
    }))
  }

  useEffect(() => {
    getComments()
  }, [])

  const comments = commentsInfo.data

  return (
    <Card
      bodyStyle={{ height: '78vh', display: 'flex', flexDirection: 'column' }}
      bordered={false}
      title={`Comments`}
      style={{ width: '100%', marginLeft: '10px', boxShadow: '0px 0px' }}
    >
      <CommentsWrapper id="CommentsWrapper">
        <InfiniteScroll
          height={'65vh'}
          dataLength={commentsInfo.pageSize}
          next={() => {
            getComments()
          }}
          hasMore={commentsInfo.hasMore}
          loader={<FullPageSkeleton />}
        >
          {comments.map((comment) => (
            <CommentCard
              comment={comment}
              handleClickLike={handleClickLike}
              key={comment.id}
            />
          ))}
        </InfiniteScroll>
      </CommentsWrapper>

      <div style={{ height: '100px', marginTop: '28px' }}>
        <TextArea
          disabled={!user}
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={!user ? "Login to leave your comment" : "Please enter your comment" }
        ></TextArea>
        <Button
          style={{ marginTop: '8px', float: 'right' }}
          loading={isAddingComment}
          type="primary"
          disabled={!comment}
          onClick={submitComment}
        >
          Submit
        </Button>
      </div>
    </Card>
  )
}

const CommentCard = ({
  comment,
  handleClickLike
}: {
  comment: Comment
  handleClickLike: (commentId: number) => () => Promise<boolean | undefined>
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <span style={{ fontSize: '16px', whiteSpace: 'pre-line' }}>
        {comment.content}
      </span>
      <div style={{ color: 'gray' }}>
        <div>
          <AvatarDisplay
            avatarSrc={comment.user.userProfile?.avatar}
            toCreatorHome={comment.user.id}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              verticalAlign: 'middle',
              marginRight: '10px'
            }}
          />
          <CreatorName
            style={{ display: 'inline' }}
            toCreatorHome={comment.user.id}
          >
            {comment.user.username}
          </CreatorName>
        </div>
        <div style={{ marginTop: '3px' }}>
          <span>
            <a onClick={handleClickLike(comment.id)}>
              <LikeOutlined
                style={{
                  marginRight: '5px',
                  color: '#d3d3d3',
                  ...(comment.isLiked ? { color: 'red' } : {})
                }}
              />
            </a>
            {comment.likes}
          </span>
          <span style={{ float: 'right' }}>
            {new Date(comment.createTime).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

const CommentsWrapper = styled.div`
  flex: 1;
  height: 65vh;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`
