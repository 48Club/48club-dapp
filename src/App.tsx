import { RouterProvider } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'
import './App.css'
import './i18n'
import routes from './router'
import axios from 'axios'
import { useEffect } from 'react'
import { useInscriptionsEffectData } from './store'


export const githubUrl = 'https://raw.githubusercontent.com/48Club/web3_app/main'

export const getStaticUrl = (type: "border" | "lv" | "avatar", name: string) => {
  return `${githubUrl}/public/static/${type}/${name}.png`
}

// 4.24.15
export default function App() {
  // const { t } = useTranslation()

  const { setEffectData } = useInscriptionsEffectData()

  useEffect(() => {
    axios.get(githubUrl + '/inscriptions.json').then((res: any) => {
      setEffectData(res)
    })
  }, [])

  return <RouterProvider router={routes} />;
}
