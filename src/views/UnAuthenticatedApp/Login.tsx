import { Card, Form, Input, Button } from 'antd'

import { Container } from '@/components/LoginFormContainer'
import { useAuth } from '@/context/auth-context'

export const Login = ({
  setIsRegister
}: {
  setIsRegister: (type: boolean) => void
}) => {
  const { login } = useAuth()

  const submit = (values: { email: string; password: string }) => {
    login({ ...values })
  }

  const rules = {
    email: [{ required: true, message: '请输入邮箱' }],
    password: [{ required: true, message: '请输入密码' }]
  }

  return (
    <Container>
      <Card title={'登录'}>
        <Form onFinish={submit}>
          <Form.Item name={'email'} rules={rules.email}>
            <Input placeholder={'邮箱'} type={'text'} id={'email'} />
          </Form.Item>
          <Form.Item name={'password'} rules={rules.password}>
            <Input placeholder={'密码'} type={'text'} id={'password'} />
          </Form.Item>
          <Form.Item>
            <Button loading={false} htmlType={'submit'} type={'primary'} block>
              登录
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              block
              loading={false}
              type={'primary'}
              onClick={() => setIsRegister(true)}
            >
              去注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  )
}
