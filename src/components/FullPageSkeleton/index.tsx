import { Skeleton } from 'antd'

export const FullPageSkeleton = ({ hasAvatar = false }: { hasAvatar?: boolean }) => {
  return (
    <>
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
      {hasAvatar && <Skeleton active avatar />}
      <Skeleton active />
      <Skeleton active />
    </>
  )
}
