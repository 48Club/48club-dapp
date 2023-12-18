import { RouterProvider } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'
import './App.css'
import './i18n'
import routes from './router'

// 4.24.15
export default function App() {
  // const { t } = useTranslation()

  return <RouterProvider router={routes} />;
}
