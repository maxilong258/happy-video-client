import { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import styled from '@emotion/styled'

export const CreatorName = ({
  toCreatorHome,
  style,
  children,
  ...restProps
}: {
  toCreatorHome?: number
  style?: React.CSSProperties
  children?: ReactNode,
  [key: string]: any
}) => {
  const navigate = useNavigate()

  const defaultStyle: React.CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: '1',
    ...(toCreatorHome ? { cursor: 'pointer' } : {})
  }

  const commonProps = {
    ...(!toCreatorHome
      ? null
      : {
          onClick: (e: any) => {
            e.stopPropagation()
            navigate(`/creator/${toCreatorHome}`)
          }
        }),
    style: {
      ...defaultStyle,
      ...style
    },
    ...restProps
  }

  return toCreatorHome ? (
    <Name {...commonProps}>{children}</Name>
  ) : (
    <span {...commonProps}>{children}</span>
  )
}

const Name = styled.span`
  &:hover {
    color: #00afc0;
  }
`
