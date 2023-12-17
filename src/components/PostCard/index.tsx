import { Post } from '@/types/post'
import { Card } from 'antd'
import { AvatarDisplay } from '../AvatarDisplay'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'
import { CreatorName } from '../CreatorName'

export const PostCard = ({
  post,
  loading
}: {
  post: Post
  loading?: boolean
}) => {
  const navigate = useNavigate()

  const handleClickPost = (post: Post) => {
    if (post.source) navigate(`/auditorium/${post.id}`)
    else window.location.href = post.linkUrl || '#'
  }

  return (
    <PostCardContainer
      className="post-card"
      loading={loading}
      bordered={false}
      cover={
        <img
          style={{ maxWidth: '334px', maxHeight: '187px', objectFit: 'cover'}}
          alt={post.title}
          src={post.type === 'video' ? post.coverPic : post.source}
        />
      }
      onClick={() => handleClickPost(post)}
      bodyStyle={{ padding: '10px' }}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ margin: '5px' }}>
          <AvatarDisplay
            avatarSrc={post.user.userProfile.avatar}
            toCreatorHome={post.user.id}
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        </div>
        <div style={{ margin: '5px' }}>
          <VidoeTitle>{post.title}</VidoeTitle>
          <CreatorName toCreatorHome={post.user.id}>
            {post.user.username}
          </CreatorName>
          <div style={{ fontSize: '12px' }}>
            {`${post?.views} views |`} {`${post?.likes} likes |`}{' '}
            {`${new Date(post?.createTime).toLocaleString()}`}
          </div>
        </div>
      </div>
    </PostCardContainer>
  )
}

export const VidoeTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  width: 100%;
`

const PostCardContainer = styled(Card)`
  width: 334px;
  height: 300px;
  margin: 15px;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 10px 0px #ccc;
  }
`
