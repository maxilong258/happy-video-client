import { Image } from 'antd'
import defaultAvatar from '@/assets/default-avatar.png'
import { useNavigate } from 'react-router'

export const AvatarDisplay = ({
  avatarSrc,
  canPreview,
  toCreatorHome,
  style,
  ...restProps
}: {
  avatarSrc?: string
  canPreview?: boolean
  toCreatorHome?: number | false
  style?: React.CSSProperties
  [key: string]: any
}) => {
  const navigate = useNavigate()

  const commonProps = {
    src: avatarSrc || defaultAvatar,
    alt: 'avatar',
    ...(!toCreatorHome
      ? null
      : {
          onClick: (e: any) => {
            e.stopPropagation()
            navigate(`/creator/${toCreatorHome}`)
          }
        }),
    style: {
      objectFit: 'cover',
      ...style
    } as React.CSSProperties,
    ...restProps
  }
  return (
    <span style={toCreatorHome ? { cursor: 'pointer' } : {}}>
      {canPreview ? <Image {...commonProps} /> : <img {...commonProps} />}
    </span>
  )
}
