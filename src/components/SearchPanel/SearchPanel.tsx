import { Input } from 'antd'
import { useNavigate } from 'react-router'

const { Search } = Input

export const SearchPanel = () => {
  const navigate = useNavigate()

  const onSearch = (value: string) => {
    navigate(`/search/${value}`)
  }

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <Search
        style={{ margin: 'auto', maxWidth: '500px' }}
        placeholder="input search text"
        onSearch={onSearch}
        enterButton
      />
    </div>
  )
}
