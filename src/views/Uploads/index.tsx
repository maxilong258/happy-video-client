import { Card, Tabs, TabsProps } from 'antd'
import { VideosTable } from './VideosTable'
import { StudioContainer } from '../Dashboard'
import { PhotosTable } from './PhotosTable'

export const Uploads = () => {
  const items: TabsProps['items'] = [
    {
      key: 'videos',
      label: `Videos`,
      children: <VideosTable />
    },
    {
      key: 'photos',
      label: `Photos`,
      children: <PhotosTable />
    }
  ]

  return (
    <StudioContainer>
      <h2>Channel content</h2>
      <Card>
        <Tabs defaultActiveKey="videos" items={items} />
      </Card>
    </StudioContainer>
  )
}
