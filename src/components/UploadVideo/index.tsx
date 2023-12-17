import { Post } from '@/types/post'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { Button, Drawer, Space, Form, Input, message } from 'antd'
import { useState } from 'react'
const { TextArea } = Input
import { VideoUploader } from '@/components/VideoUploader'
import { VideoCoverUploader } from '@/components/VideoCoverUploader'
import { FetchRes } from '@/types/fetch-res'

export const UploadVideo = ({onSubmit = () => null}: {onSubmit?: () => void}) => {
  const [form] = Form.useForm()
  const [isShowVideoUploader, setIsShowVideoUploader] = useState(false)

  const client = useHttp()
  const { run: fetchUploadVideo, isLoading: isUploadingVideo } =
    useAsync<FetchRes<Post>>()

  const submit = async (values: Partial<Post>) => {
    const res = await fetchUploadVideo(
      client('posts', { data: { ...values, type: 'video' }, method: 'POST' })
    )
    if (res.success) {
      message.success('Video uploaded')
      setIsShowVideoUploader(false)
      onSubmit()
    }
  }

  const uploadUrl = import.meta.env.VITE_BASE_UPLOAD_URL
  return (
    <>
      <Button shape="round" onClick={() => setIsShowVideoUploader(true)}>
        Upload videos
        <VerticalAlignTopOutlined />
      </Button>

      <Drawer
        width={600}
        title={`Upload video`}
        headerStyle={{ height: '56px' }}
        onClose={() => setIsShowVideoUploader(false)}
        open={isShowVideoUploader}
        destroyOnClose={true}
        footer={
          <Space style={{ float: 'right' }}>
            <Button
              onClick={form.submit}
              loading={isUploadingVideo}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form form={form} onFinish={submit} layout={'vertical'}>
          <Form.Item label="Video" name={'source'} rules={[{ required: true }]}>
            <VideoUploader
              uploadUrl={uploadUrl}
              onUploadDone={(path) => form.setFieldsValue({ source: path })}
              onUploadRemove={() => form.setFieldsValue({ source: '' })}
            />
          </Form.Item>

          <Form.Item
            label="Cover"
            name={'coverPic'}
            rules={[{ required: true }]}
          >
            <VideoCoverUploader
              uploadUrl={uploadUrl}
              onUploadDone={(path) => form.setFieldsValue({ coverPic: path })}
              onUploadRemove={() => form.setFieldsValue({ coverPic: '' })}
            />
          </Form.Item>
          <Form.Item label="Title" name={'title'} rules={[{ required: true }]}>
            <Input maxLength={300} type={'text'} />
          </Form.Item>
          <Form.Item label="Introduct" name={'introduct'}>
            <TextArea maxLength={100000} showCount={true} rows={5} />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}
