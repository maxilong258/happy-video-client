import { FetchRes } from '@/types/fetch-res'
import { Post } from '@/types/post'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { Button, Drawer, Space, Form, Input, message, UploadFile, Upload, UploadProps } from 'antd'
import { RcFile } from 'antd/es/upload'
import { useState } from 'react'
const { TextArea } = Input

export const UploadPainting = ({onSubmit = () => null}: {onSubmit?: () => void}) => {
  const [form] = Form.useForm()
  const [isShowPaintingUploader, setIsShowPaintingUploader] = useState(false)

  const client = useHttp()
  const { run: fetchUploadPainting, isLoading: isUploadingPainting } =
    useAsync<FetchRes<Post>>()

  const submit = async (values: Partial<Post>) => {
    const res = await fetchUploadPainting(
      client('posts', { data: { ...values, type: 'painting' }, method: 'POST' })
    )
    if (res.success) {
      message.success('Painting uploaded')
      setIsShowPaintingUploader(false)
      onSubmit()
    }
  }

  const uploadUrl = import.meta.env.VITE_BASE_UPLOAD_URL
  return (
    <>
      <Button shape="round" onClick={() => setIsShowPaintingUploader(true)}>
        Upload photos
        <VerticalAlignTopOutlined />
      </Button>

      <Drawer
        width={600}
        title={`Upload painting`}
        headerStyle={{ height: '56px' }}
        onClose={() => setIsShowPaintingUploader(false)}
        open={isShowPaintingUploader}
        destroyOnClose={true}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={form.submit} loading={isUploadingPainting}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form form={form} onFinish={submit} layout={'vertical'}>
          <Form.Item
            label="Painting"
            name={'source'}
            rules={[{ required: true }]}
          >
            <PaintingUploader
              uploadUrl={uploadUrl}
              onUploadDone={(path) => form.setFieldsValue({ source: path })}
              onUploadRemove={() => form.setFieldsValue({ source: '' })}
            />
          </Form.Item>

          <Form.Item label="Title" name={'title'} rules={[{ required: true }]}>
            <Input maxLength={300} type={'text'} />
          </Form.Item>
          <Form.Item label="Introduct" name={'introduct'}>
            <TextArea maxLength={100000} showCount={true} rows={20} />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

const PaintingUploader = ({
  uploadUrl,
  onUploadDone,
  onUploadRemove
}: {
  uploadUrl: string
  onUploadDone: (path: string) => void
  onUploadRemove: () => void
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const beforeUpload = (file: RcFile) => {
    if (!file.type.startsWith('image')) {
      message.error('please upload image')
      return false
    }
    if (file.size > 1024 * 1024 * 20) {
      message.error('file size must be less than 20MB')
      return false
    }
  }

  const onChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList)
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      onUploadDone(info.file.response?.data.path)
    }
  }

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const onRemove = () => {
    onUploadRemove()
    return true
  }

  return (
    <Upload
      multiple
      action={uploadUrl}
      maxCount={3}
      data={{type: 'painting'}}
      listType="picture-card"
      fileList={fileList}
      beforeUpload={beforeUpload}
      onChange={onChange}
      onPreview={onPreview}
      onRemove={onRemove}
    >
      {fileList.length < 5 && '+ Upload'}
    </Upload>
  )
}
