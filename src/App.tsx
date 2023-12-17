import { useRoutes } from 'react-router'
import { routes } from '@/routes'
function App() {
  const SetupRoutes = () => useRoutes(routes)
  return <>
   <SetupRoutes />
  </>
}

export default App
