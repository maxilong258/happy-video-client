import { FullPageLoading } from '@/components/FullPageLoadingAndError'
import { VideoCoverUploader } from '@/components/VideoCoverUploader'
import { FetchRes } from '@/types/fetch-res'
import { Post } from '@/types/post'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { Button, Drawer, Form, Input, Space, message } from 'antd'
import { useEffect, useState } from 'react'
const { TextArea } = Input

export const ModifyPostInfo = ({
  refresh,
  postType,
  postId
}: {
  refresh: () => void
  postType: 'video' | 'painting'
  postId: number
}) => {
  const [form] = Form.useForm()
  const [isShowModifyDrawer, setIsShowModifyDrawer] = useState(false)
  const uploadUrl = import.meta.env.VITE_BASE_UPLOAD_URL

  const client = useHttp()
  const {
    run: fetchPostInfo,
    isLoading: isFetchingPostInfo,
    data: postInfo
  } = useAsync<FetchRes<Post>>()

  const {
    run: modifyPostInfo,
    isLoading: isModifyingPostInfo
    // data: newVideoInfo
  } = useAsync<FetchRes<Post>>()

  const submit = async (values: Partial<Post>) => {
    const res = await modifyPostInfo(
      client(`posts/${postId}`, {
        data: { ...values, type: postType },
        method: 'PATCH'
      })
    )
    if (res.success) {
      message.success('Post modify success')
      setIsShowModifyDrawer(false)
      refresh()
    }
  }
  useEffect(() => {
    if (isShowModifyDrawer) {
      fetchPostInfo(client(`posts/${postId}`, {}))
    }
  }, [isShowModifyDrawer])

  return (
    <>
      <a onClick={() => setIsShowModifyDrawer(true)}>Modify</a>

      <Drawer
        width={600}
        title={`Modify Post info`}
        headerStyle={{ height: '56px' }}
        onClose={() => setIsShowModifyDrawer(false)}
        open={isShowModifyDrawer}
        destroyOnClose={true}
        footer={
          <Space style={{ float: 'right' }}>
            <Button
              loading={isFetchingPostInfo || isModifyingPostInfo}
              onClick={() => form.submit()}
            >
              Submit
            </Button>
          </Space>
        }
      >
        {!postInfo ? (
          <FullPageLoading />
        ) : (
          <Form
            form={form}
            onFinish={submit}
            layout={'vertical'}
            initialValues={{
              title: postInfo.data.title,
              introduct: postInfo.data.introduct,
              coverPic: postInfo.data.coverPic
            }}
          >
            {postType === 'video' && (
              <Form.Item
                label="Cover"
                name={'coverPic'}
                rules={[{ required: true }]}
              >
                <VideoCoverUploader
                  initialUrl={postInfo.data.coverPic}
                  uploadUrl={uploadUrl}
                  onUploadDone={(path) =>
                    form.setFieldsValue({ coverPic: path })
                  }
                  onUploadRemove={() => form.setFieldsValue({ coverPic: '' })}
                />
              </Form.Item>
            )}

            <Form.Item
              label="Title"
              name={'title'}
              rules={[{ required: true }]}
            >
              <Input maxLength={300} type={'text'} />
            </Form.Item>
            <Form.Item label="Introduct" name={'introduct'}>
              <TextArea maxLength={100000} showCount={true} rows={5} />
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </>
  )
}
