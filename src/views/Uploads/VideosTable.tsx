import { Post } from '@/types/post'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { Descriptions, Popconfirm, Table, message } from 'antd'
import { useEffect } from 'react'
import { ModifyPostInfo } from './ModifyPostInfo'
import { UploadVideo } from '@/components/UploadVideo'
import { FetchRes } from '@/types/fetch-res'

export const VideosTable = () => {
  const client = useHttp()

  const {
    run: fetchMyVideos,
    isLoading: isFetchingMyVideos,
    data: myVideos
  } = useAsync<FetchRes<{ total: number; posts: Post[] }>>()

  const { run: deleteTheVideo } = useAsync<FetchRes<Post>>()

  const getMyVideos = async ({
    current = 1,
    pageSize = 10
  }: {
    current?: number
    pageSize?: number
    total?: number
  }) => {
    await fetchMyVideos(
      client('posts/my', {
        data: { type: 'video', page: current, limit: pageSize }
      })
    )
  }

  const deleteVideo = async (id: number) => {
    const res = await deleteTheVideo(
      client(`posts/${id}`, { method: 'DELETE' })
    )
    if (!res.success) return
    message.success('Delete success!')
    getMyVideos({})
  }

  useEffect(() => {
    getMyVideos({})
  }, [])

  const TableData = myVideos?.data.posts.map((video) => ({
    key: video.id,
    ...video
  }))

  const columns = [
    { title: 'ID', dataIndex: 'key', key: 'key' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (item: Date) => {
        return new Date(item).toLocaleString()
      }
    },
    { title: 'Likes', dataIndex: 'likes', key: 'likes' }
  ]

  const expandedRowRender = (record: any) => {
    return (
      <>
        <Descriptions column={1}>
          <Descriptions.Item
            style={{ whiteSpace: 'pre-line' }}
            label="Description"
          >
            {record.introduct}
          </Descriptions.Item>
          <Descriptions.Item label="Cover picture">
            <a href={record.coverPic}>{record.coverPic}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Source">
            <a href={record.source}>{record.source}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Options">
            <ModifyPostInfo
              refresh={() => getMyVideos({})}
              postType="video"
              postId={record.id}
            />
            <Popconfirm
              title="Delete the video?"
              description={
                <>
                  Are you sure to delete this video?
                  <br />
                  {record.title}
                </>
              }
              onConfirm={() => deleteVideo(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <a style={{ color: 'red', marginLeft: '10px' }}>Delete</a>
            </Popconfirm>
          </Descriptions.Item>
        </Descriptions>
      </>
    )
  }

  return (
    <>
      <span style={{ float: 'right', marginBottom: '16px' }}>
        <UploadVideo onSubmit={() => getMyVideos({})} />
      </span>
      <Table
        columns={columns}
        dataSource={TableData}
        loading={isFetchingMyVideos}
        expandable={{ expandedRowRender }}
        pagination={{ total: myVideos?.data.total }}
        onChange={getMyVideos}
      />
    </>
  )
}
