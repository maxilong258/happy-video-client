import { Post } from '@/types/post'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { Descriptions, Popconfirm, Table, message } from 'antd'
import { useEffect } from 'react'
import { ModifyPostInfo } from './ModifyPostInfo'
import { UploadPainting } from '@/components/UploadPainting'
import { FetchRes } from '@/types/fetch-res'

export const PhotosTable = () => {
  const client = useHttp()

  const {
    run: fetchMyPhotosTable,
    isLoading: isFetchingMyPhotos,
    data: myPhotos
  } = useAsync<FetchRes<{ total: number; posts: Post[] }>>()

  const { run: deleteThePhoto } = useAsync<FetchRes<Post>>()

  const getMyPhotos = async ({
    current = 1,
    pageSize = 10
  }: {
    current?: number
    pageSize?: number
    total?: number
  }) => {
    await fetchMyPhotosTable(
      client('posts/my', {
        data: {
          type: 'painting',
          page: current,
          limit: pageSize
        }
      })
    )
  }

  const deletePhoto = async (id: number) => {
    const res = await deleteThePhoto(
      client(`posts/${id}`, { method: 'DELETE' })
    )
    if (!res.success) return 
    message.success('Delete success!')
    getMyPhotos({})
  }

  useEffect(() => {
    getMyPhotos({})
  }, [])

  const TableData = myPhotos?.data.posts.map((photo) => ({
    key: photo.id,
    ...photo
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
          <Descriptions.Item label="Source">
            <a href={record.source}>{record.source}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Options">
            <ModifyPostInfo
              refresh={() => getMyPhotos({})}
              postType="painting"
              postId={record.id}
            />
            <Popconfirm
              title="Delete the photo?"
              description={
                <>
                  Are you sure to delete this photo?
                  <br />
                  {record.title}
                </>
              }
              onConfirm={() => deletePhoto(record.id)}
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
        <UploadPainting onSubmit={() => getMyPhotos({})} />
      </span>
      <Table
        columns={columns}
        dataSource={TableData}
        loading={isFetchingMyPhotos}
        expandable={{ expandedRowRender }}
        pagination={{ total: myPhotos?.data.total }}
        onChange={getMyPhotos}
      />
    </>
  )
}
