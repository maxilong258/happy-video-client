import { InboxOutlined } from '@ant-design/icons'
import { Card, UploadProps, message } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import { useState } from 'react'
import { VideoPlayer } from '../VideoPlayer'

export const VideoUploader = ({
  uploadUrl,
  onUploadDone,
  onUploadRemove
}: {
  uploadUrl: string
  onUploadDone: (path: string) => void
  onUploadRemove: () => void
}) => {
  const [videoPath, setVideoPath] = useState('')

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: uploadUrl,
    maxCount: 1,
    data: {type: 'video'},
    beforeUpload(file) {
      if (file.type !== 'video/mp4') {
        message.error('Sorry, video/mp4 only')
        return false
      }
      return true
    },
    onChange(info) {
      const { status } = info.file
      // if (status !== 'uploading') {
      //   console.log(info.file, info.fileList)
      // }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
        const path = info.file.response?.data.path
        onUploadDone(path)
        setVideoPath(path)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    // onDrop(e) {
    //   console.log('Dropped files', e.dataTransfer.files)
    // },
    onRemove() {
      onUploadRemove()
      setVideoPath('')
      return true
    }
  }

  return (
    <Card style={{ height: 'auto' }}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag mp4 video to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>

      {videoPath && (
        <div style={{ marginTop: '10px' }}>
          <VideoPlayer src={videoPath} />
        </div>
      )}
    </Card>
  )
}
