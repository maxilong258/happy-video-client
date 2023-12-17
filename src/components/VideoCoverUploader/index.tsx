import { UploadOutlined } from '@ant-design/icons'
import { Button, Card, Upload, UploadFile, UploadProps, message } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useEffect, useState } from 'react'

export const VideoCoverUploader = ({
  uploadUrl,
  onUploadDone,
  onUploadRemove,
  initialUrl
}: {
  uploadUrl: string
  onUploadDone: (path: string) => void
  onUploadRemove: () => void
  initialUrl?: string
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const beforeUpload = (file: any) => {
    if (!file.type.startsWith('image')) {
      message.error('please upload image')
      return false
    }
    if (file.size > 1024 * 1024 * 5) {
      message.error('file size must be less than 5MB')
      return false
    }
  }
  

  const onChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList)
    if (info.file.status === 'done') {
      onUploadDone(info.file.response?.data.path)
    }
  }

  useEffect(() => {
    if (!initialUrl) return
    setFileList([
      {
        uid: '-1',
        name: 'Current-cover.png',
        status: 'done',
        url: initialUrl
      }
    ])
  }, [initialUrl])

  return (
    <Card style={{ height: '135px' }}>
      <ImgCrop rotationSlider aspect={16 / 9}>
        <Upload
          action={uploadUrl}
          listType="picture"
          fileList={fileList}
          onChange={onChange}
          maxCount={1}
          beforeUpload={beforeUpload}
          onRemove={onUploadRemove}
          data={{ type: 'video-cover' }}
        >
          {fileList.length < 1 && (
            <Button icon={<UploadOutlined />}>Upload</Button>
          )}
        </Upload>
      </ImgCrop>
    </Card>
  )
}
