import { Button, Card, Form, Input } from 'antd'
import { Container } from '@/components/LoginFormContainer'
import { useAuth } from '@/context/auth-context'

export const Register = ({
  setIsRegister
}: {
  setIsRegister: (type: boolean) => void
}) => {
  const { register } = useAuth()
  const submit = (value: {
    username: string
    password: string
    email: string
  }) => {
    register({ ...value })
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
      <Card title={'注册'}>
        <Form onFinish={submit}>
          <Form.Item name={'username'} rules={rules.username}>
            <Input placeholder={'用户名'} type={'text'} id={'username'} />
          </Form.Item>
          <Form.Item name={'email'} rules={rules.email}>
            <Input placeholder={'邮箱'} type={'text'} id={'email'} />
          </Form.Item>
          <Form.Item name={'password'} rules={rules.password}>
            <Input placeholder={'密码'} type={'text'} id={'password'} />
          </Form.Item>
          <Form.Item name={'confirmPassword'} rules={rules.confirmPassword}>
            <Input
              placeholder={'确认密码'}
              type={'text'}
              id={'confirmPassword'}
            />
          </Form.Item>
          <Form.Item>
            <Button block htmlType={'submit'} type={'primary'}>
              注册
            </Button>
          </Form.Item>
          <Form.Item>
            <Button block type={'primary'} onClick={() => setIsRegister(false)}>
              已有账号？去登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  )
}
