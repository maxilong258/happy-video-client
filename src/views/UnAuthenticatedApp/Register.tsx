import { Button, Card, Form, Input } from 'antd'
import { Container } from '@/components/LoginFormContainer'
import { useAuth } from '@/context/auth-context'
import { useNavigate } from 'react-router'
import { ArrowLeftOutlined } from '@ant-design/icons'

export const Register = ({
  setIsRegister,
  isNeedRedirectToHome
}: {
  setIsRegister: (type: boolean) => void
  isNeedRedirectToHome: boolean
}) => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const submit = async (value: {
    username: string
    password: string
    email: string
  }) => {
    const user = await register({ ...value })
    if (isNeedRedirectToHome && user) {
      navigate('/')
    }
  }

  const rules = {
    username: [{ required: true, message: '请输入用户名' }],
    password: [{ required: true, message: '请输入密码' }],
    email: [{ required: true, message: '请输入邮箱' }],
    confirmPassword: [
      { required: true, message: '请再次输入密码' },
      ({ getFieldValue }: any) => ({
        validator(_: any, value: any) {
          if (!value || getFieldValue('password') === value)
            return Promise.resolve()
          return Promise.reject(
            new Error('The new password that you entered do not match!')
          )
        }
      })
    ]
  }

  return (
    <Container>
      <Card
        title={
          <>
            <Button
              type="link"
              onClick={() => {
                navigate('/')
              }}
            >
              <ArrowLeftOutlined />
            </Button>
            Register
          </>
        }
      >
        <Form onFinish={submit}>
          <Form.Item name={'username'} rules={rules.username}>
            <Input placeholder={'Username'} type={'text'} id={'username'} />
          </Form.Item>
          <Form.Item name={'email'} rules={rules.email}>
            <Input placeholder={'Email'} type={'text'} id={'email'} />
          </Form.Item>
          <Form.Item name={'password'} rules={rules.password}>
            <Input placeholder={'Password'} type={'text'} id={'password'} />
          </Form.Item>
          <Form.Item name={'confirmPassword'} rules={rules.confirmPassword}>
            <Input
              placeholder={'Confirm Password'}
              type={'text'}
              id={'confirmPassword'}
            />
          </Form.Item>
          <Form.Item>
            <Button block htmlType={'submit'} type={'primary'}>
              Register
            </Button>
          </Form.Item>
          <Form.Item>
            <Button block type={'primary'} onClick={() => setIsRegister(false)}>
              Already have a account, go login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  )
}
