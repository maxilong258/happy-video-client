import { FullPageLoading } from '@/components/FullPageLoadingAndError'
import { User } from '@/types/user'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { EditOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Form, Image, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
const { TextArea } = Input
import dayjs from 'dayjs'
import { ImageUploader } from '@/components/ImageUploader'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { StudioContainer } from '../Dashboard'
import { FetchRes } from '@/types/fetch-res'

export const Profile = () => {
  const [editingName, setEditingName] = useState('')
  const [form] = useForm()
  const client = useHttp()
  const {
    run: fetchMyProfile,
    isLoading: isFetchingMyProfile,
    data: myProfile
  } = useAsync<FetchRes<User>>()

  const {
    run: modifyMyProfile,
    isLoading: isModifyingMyProfile
    // data: modifyRes
  } = useAsync<FetchRes<User>>()

  const getMyProfile = () => {
    fetchMyProfile(client('user/getMyProfile', {}))
  }

  const saveProfileItem = async (values: any) => {
    const data = {
      username: values.username,
      userProfile: {
        avatar: values.avatar,
        birthday: values.birthday,
        country: values.country,
        background: values.background,
        introduction: values.introduction
      }
    }
    const res = await modifyMyProfile(
      client('user/modifyMyProfile', { method: 'PATCH', data })
    )
    if (res.success) {
      message.success('Modify profile successfully')
      setEditingName('')
      getMyProfile()
      return
    }
  }

  const EditingOptions = () => {
    return (
      <span>
        <Button
          type="link"
          onClick={() => {
            form.resetFields()
            setEditingName('')
          }}
        >
          Cancel
        </Button>
        <Button type="link" htmlType="submit" loading={isModifyingMyProfile}>
          Save
        </Button>
      </span>
    )
  }

  const EditBtn = ({ onClick }: { onClick: () => void }) => {
    if (editingName !== '') return null
    return (
      <EditOutlined
        style={{ marginLeft: '5px', color: 'blue' }}
        onClick={onClick}
      />
    )
  }

  useEffect(() => {
    getMyProfile()
  }, [])

  return (
    <StudioContainer>
      <h2>Your Profile</h2>
      {isFetchingMyProfile ? (
        <FullPageLoading />
      ) : (
        <Card>
          <Form
            form={form}
            initialValues={{
              username: myProfile?.data.username,
              avatar: myProfile?.data.userProfile.avatar,
              country: myProfile?.data.userProfile.country,
              birthday: myProfile?.data.userProfile.birthday,
              introduction: myProfile?.data.userProfile.introduction
            }}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            style={{ maxWidth: 900 }}
            onFinish={saveProfileItem}
          >
            <Form.Item label="Name" name="username">
              {editingName === 'username' ? (
                <div>
                  <Input
                    style={{ maxWidth: '450px' }}
                    defaultValue={form.getFieldValue('username')}
                  />
                  <EditingOptions />
                </div>
              ) : (
                <div>
                  {myProfile?.data.username}{' '}
                  <EditBtn
                    onClick={() => {
                      form.setFieldsValue({
                        username: myProfile?.data.username
                      })
                      setEditingName('username')
                    }}
                  />
                </div>
              )}
            </Form.Item>

            <Form.Item label="Avatar" name="avatar">
              {editingName === 'avatar' ? (
                <div>
                  <ImageUploader
                    uploadUrl={import.meta.env.VITE_BASE_UPLOAD_URL}
                    type={'avatar'}
                    maxSize={1024 * 1024 * 2}
                    onUploadDone={(path) => {
                      form.setFieldsValue({
                        avatar: path
                      })
                    }}
                  />
                  <EditingOptions />
                </div>
              ) : (
                <div>
                  <AvatarDisplay
                    avatarSrc={myProfile?.data.userProfile.avatar}
                    canPreview={true}
                    style={{
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%'
                    }}
                  />
                  <EditBtn
                    onClick={() => {
                      form.setFieldsValue({
                        avatar: myProfile?.data.userProfile.avatar
                      })
                      setEditingName('avatar')
                    }}
                  />
                </div>
              )}
            </Form.Item>

            <Form.Item label="Background" name="background">
              {editingName === 'background' ? (
                <div>
                  <ImageUploader 
                    uploadUrl={import.meta.env.VITE_BASE_UPLOAD_URL}
                    type={'background'}
                    aspect={21 / 9}
                    onUploadDone={(path) => {
                      form.setFieldsValue({
                        background: path
                      })
                    }}
                  />
                  <EditingOptions />
                </div>
              ) : (
                <div>
                  <Image src={myProfile?.data.userProfile.background} />
                  <EditBtn
                    onClick={() => {
                      form.setFieldsValue({
                        background: myProfile?.data.userProfile.background
                      })
                      setEditingName('background')
                    }}
                  />
                </div>
              )}
            </Form.Item>

            <Form.Item label="Country" name="country">
              {editingName === 'country' ? (
                <div>
                  <Input
                    style={{ maxWidth: '450px' }}
                    defaultValue={form.getFieldValue('country')}
                  />
                  <EditingOptions />
                </div>
              ) : (
                <div>
                  {myProfile?.data.userProfile.country}
                  <EditBtn
                    onClick={() => {
                      form.setFieldsValue({
                        country: myProfile?.data.userProfile.country
                      })
                      setEditingName('country')
                    }}
                  />
                </div>
              )}
            </Form.Item>

            <Form.Item label="Birthday" name="birthday">
              {editingName === 'birthday' ? (
                <div>
                  <DatePicker
                    onChange={(_, dateString) => {
                      form.setFieldsValue({
                        birthday: dateString
                      })
                    }}
                    defaultValue={dayjs(
                      form.getFieldValue('birthday') || new Date()
                    )}
                  />
                  <EditingOptions />
                </div>
              ) : (
                <div>
                  {myProfile?.data.userProfile.birthday}
                  <EditBtn
                    onClick={() => {
                      form.setFieldsValue({
                        birthday: myProfile?.data.userProfile.birthday
                      })
                      setEditingName('birthday')
                    }}
                  />
                </div>
              )}
            </Form.Item>

            <Form.Item label="Introduction" name="introduction">
              {editingName === 'introduction' ? (
                <div>
                  <TextArea
                    style={{ maxWidth: '450px' }}
                    defaultValue={form.getFieldValue('introduction')}
                    autoSize={{ minRows: 2, maxRows: 8 }}
                  />
                  <EditingOptions />
                </div>
              ) : (
                <div style={{ whiteSpace: 'pre-line' }}>
                  {myProfile?.data.userProfile.introduction}
                  <EditBtn
                    onClick={() => {
                      form.setFieldsValue({
                        introduction: myProfile?.data.userProfile.introduction
                      })
                      setEditingName('introduction')
                    }}
                  />
                </div>
              )}
            </Form.Item>
          </Form>
        </Card>
      )}
    </StudioContainer>
  )
}
