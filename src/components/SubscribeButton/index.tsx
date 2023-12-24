import { FetchRes } from '@/types/fetch-res'
import { optimisticUpdate } from '@/utils/optimistic-update'
import { useAsync } from '@/utils/use-async'
import { useHttp } from '@/utils/use-http'
import { BellOutlined } from '@ant-design/icons'
import { Button, Popconfirm, message } from 'antd'
import { useEffect } from 'react'

export const SubscribeButton = ({
  userId,
  creatorId
}: {
  userId?: number
  creatorId?: number
}) => {
  const client = useHttp()

  const {
    run: fetchSubscribeStatus,
    data: subscribeStatusRes,
    setData
  } = useAsync<FetchRes<{ subscribeStatus: boolean }>>()

  const { run: fetchSubscribe } = useAsync<FetchRes<any>>()

  if (!userId || !creatorId || userId === creatorId) return null

  const handleSubscribe = async () => {
    if (!subscribeStatusRes) return
    const [newTemp, reset] = optimisticUpdate(subscribeStatusRes, (temp) => {
      temp.data.subscribeStatus = !temp?.data.subscribeStatus
      return temp
    })
    setData(newTemp)
    const res = await fetchSubscribe(
      client(`user/subscribe`, { method: 'POST', data: { creatorId } })
    )
    if (!res.success) {
      setData(reset())
      message.error('Subscribe failed')
      return
    }
  }

  useEffect(() => {
    if (!creatorId) return
    fetchSubscribeStatus(client(`user/subscribe/${creatorId}`, {}))
  }, [])

  const followStatus = subscribeStatusRes?.data.subscribeStatus

  return (
    <Popconfirm
      placement="top"
      title={'Sure to unfollow?'}
      onConfirm={handleSubscribe}
      okText="Yes"
      cancelText="No"
      disabled={!followStatus}
    >
      <Button
        style={followStatus ? { background: '#2afc0080' } : {}}
        shape="round"
        onClick={followStatus ? undefined : handleSubscribe}
        icon={<BellOutlined />}
      >
        {followStatus ? 'Subscribed' : 'Subscribe'}
      </Button>
    </Popconfirm>
  )
}
