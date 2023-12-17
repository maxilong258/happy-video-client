import { FetchRes } from "@/types/fetch-res"
import { Post } from "@/types/post"
import { optimisticUpdate } from "@/utils/optimistic-update"
import { useAsync } from "@/utils/use-async"
import { useHttp } from "@/utils/use-http"
import { LikeOutlined } from "@ant-design/icons"
import { Button, message } from "antd"

export const LikePostButton = ({
  postInfoRes,
  setData
}: {
  postInfoRes: FetchRes<Post>
  setData: (data: FetchRes<Post>) => void
}) => {
  const client = useHttp()
  const { run: addPostLikes } = useAsync<FetchRes<Post>>()

  const postInfo = postInfoRes?.data

  const handleLike = async () => {
    if (!postInfoRes) return
    const [newTemp, reset] = optimisticUpdate(postInfoRes, (temp) => {
      temp.data.isLiked = !temp.data.isLiked
      temp.data.likes += temp.data.isLiked ? 1 : -1
      return temp
    })
    setData(newTemp)
    const res = await addPostLikes(
      client(`posts/like/${postInfo.id}`, { method: 'PATCH' })
    )
    if (!res.success) {
      setData(reset())
      return message.error('Like failed')
    }
  }

  return (
    <Button
      style={postInfo.isLiked ? { border: '1px solid #2afc0080' } : {}}
      shape="round"
      onClick={handleLike}
    >
      <LikeOutlined />
      {postInfo?.isLiked ? 'Liked' : 'Like'}
    </Button>
  )
}