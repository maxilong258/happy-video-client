import { Post } from '@/types/post'
import { optimisticUpdate } from '@/utils/optimistic-update'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { VerticalAlignBottomOutlined } from '@ant-design/icons'
import { Button, Popconfirm, message } from 'antd'

export const SavePostBtn = ({
  postInfoRes,
  setData
}: {
  postInfoRes: FetchRes<Post>
  setData: (data: FetchRes<Post>) => void
}) => {
  const client = useHttp()
  const { run: savePost } = useAsync<FetchRes<Post>>()

  const handleSave = async (postId: number) => {
    if (!postInfoRes) return
    const [newTemp, reset] = optimisticUpdate(postInfoRes, (temp) => {
      temp.data.isSaved = !temp.data.isSaved
      return temp
    })
    setData(newTemp)
    const res = await savePost(
      client(`user/collect`, { method: 'POST', data: { postId } })
    )
    if (!res.success) {
      setData(reset())
      return message.error('Save failed')
    }
  }

  const postInfo = postInfoRes.data

  return (
    <Popconfirm
      title="Cancel Save?"
      onConfirm={() => {
        handleSave(postInfo.id)
      }}
      disabled={!postInfo.isSaved}
      okText="Yes"
      cancelText="No"
    >
      <Button
        style={postInfo?.isSaved ? { border: '1px solid #2afc0080' } : {}}
        onClick={
          postInfo.isSaved
            ? undefined
            : () => {
                handleSave(postInfo.id)
              }
        }
        shape="round"
      >
        <VerticalAlignBottomOutlined />
        {postInfo?.isSaved ? 'Saved' : 'Save'}
      </Button>
    </Popconfirm>
  )
}
