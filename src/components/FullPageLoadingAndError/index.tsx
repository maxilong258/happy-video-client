import styled from "@emotion/styled";
import { Spin, Typography } from "antd";

export const FullPageLoading = () => (
  <FullPage>
    <Spin size={'large'} />
  </FullPage>
)

export const ErrorBox = (error: any) => {
  return <Typography.Text type={'danger'}>{error ? error.error.message : 'Server Error'}</Typography.Text>
}

export const FullPageErrorFallback = ({error}: {error: Error | null}) => (
  <FullPage>
    <ErrorBox error={error} />
  </FullPage>
)

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`