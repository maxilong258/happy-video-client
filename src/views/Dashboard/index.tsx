import { UploadPainting } from '@/components/UploadPainting'
import { UploadVideo } from '@/components/UploadVideo'
import styled from '@emotion/styled'
import { Card, Space } from 'antd'

export const Dashboard = () => {
  return (
    <StudioContainer>
      <h2>Channel dashboard</h2>
      <Card>
        <Space direction="vertical" size={'middle'}>
          <UploadVideo />
          <UploadPainting />
        </Space>
      </Card>
    </StudioContainer>
  )
}

export const StudioContainer = styled.div`
  margin: 0 10px;
`
