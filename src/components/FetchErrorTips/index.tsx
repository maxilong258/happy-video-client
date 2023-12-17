import { notification } from 'antd'
import { useEffect } from 'react'
import ReactDOM from 'react-dom'

const errorContainer = document.createElement('div')
document.body.appendChild(errorContainer)

export const showErrorTips = (error: any) => {
  ReactDOM.render(
    <FetchErrorTips error={error}></FetchErrorTips>,
    errorContainer
  )
}

export const FetchErrorTips = (error: any) => {
  const [api, contextHolder] = notification.useNotification()

  const openNotification = (error: any) => {
    api.error({
      message: error.statusCode,
      description: error.message
    })
  }

  useEffect(() => {
    openNotification(error.error)
  }, [error])

  return <div>{contextHolder}</div>
}
