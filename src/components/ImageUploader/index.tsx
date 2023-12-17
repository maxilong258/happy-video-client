import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload, UploadProps, message } from 'antd'
import ImgCrop from 'antd-img-crop'
import { RcFile } from 'antd/es/upload'
import { useState } from 'react'

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

export const ImageUploader = ({
  uploadUrl,
  type,
  aspect = 1 / 1,
  maxSize = 1024 * 1024 * 10,
  onUploadDone
}: {
  uploadUrl: string
  type: string
  aspect?: number
  maxSize?: number
  onUploadDone: (path: string) => void
}) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()

  const beforeUpload = (file: RcFile) => {
    if (!file.type.startsWith('image')) {
      message.error('please upload image')
      return false
    }
    if (file.size > maxSize) {
      message.error(`${type} size must be less than ${maxSize}B`)
      return false
    }
  }
  
  const onChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (file.status === 'done') {
      onUploadDone(file.response?.data.path)
      getBase64(file.originFileObj as RcFile, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  const uploadButton = (
    <Button loading={loading} icon={<UploadOutlined />}>
      Click to Upload
    </Button>
  )

  return (
    <ImgCrop rotationSlider aspect={aspect}>
      <Upload
        showUploadList={false}
        action={uploadUrl}
        data={{ type }}
        beforeUpload={beforeUpload}
        onChange={onChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="uploadImage"
            style={
              type === 'avatar'
                ? { width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover'}
                : { width: '300px', height: '130px', objectFit: 'cover' }
            }
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  )
}
