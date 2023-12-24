import { Card, Form, Input, Button } from 'antd'

import { Container } from '@/components/LoginFormContainer'
import { useAuth } from '@/context/auth-context'
import { useNavigate } from 'react-router'
import { ArrowLeftOutlined } from '@ant-design/icons'

export const Login = ({
  setIsRegister,
  isNeedRedirectToHome
}: {
  setIsRegister: (type: boolean) => void
  isNeedRedirectToHome: boolean
}) => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const submit = async (values: { email: string; password: string }) => {
    const user = await login({ ...values })
    console.log(user)
    if (isNeedRedirectToHome && user) {
      navigate('/')
    }
  }

  const rules = {
    email: [{ required: true, message: 'Please enter your email' }],
    password: [{ required: true, message: 'Please enter your password' }]
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
            Login
          </>
        }
      >
        <Form onFinish={submit}>
          <Form.Item name={'email'} rules={rules.email}>
            <Input placeholder={'Email'} type={'text'} id={'email'} />
          </Form.Item>
          <Form.Item name={'password'} rules={rules.password}>
            <Input placeholder={'Password'} type={'text'} id={'password'} />
          </Form.Item>
          <Form.Item>
            <Button loading={false} htmlType={'submit'} type={'primary'} block>
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              block
              loading={false}
              type={'primary'}
              onClick={() => setIsRegister(true)}
            >
              Go register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  )
}
