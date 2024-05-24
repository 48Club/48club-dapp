import { Space, Tabs } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useInscriptionsSearchState } from '@/store'
import useUrlState from '@ahooksjs/use-url-state'

const tabList = [
  {
    label: 'Explorer',
    key: 'explorer',
    hash: 'explorer',
  },
  {
    label: 'Marketplace',
    key: 'marketplace',
    hash: 'marketplace',
  },
  {
    label: 'Account',
    key: 'account',
    hash: 'account',
  },
  {
    label: 'Wrapped',
    key: 'wrapped',
    hash: 'wrapped',
  },

  // {
  //     label: "Ecosystem",
  //     key: 'Ecosystem',
  //     node: < />
  // },
  {
    label: (
      <Space>
        Documents
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.2387 7.24898V10.8732C11.2387 11.4836 10.7256 12.0001 10.1193 12.0001H1.11938C0.513048 12.0001 0 11.4836 0 10.8732V1.8127C0 1.20229 0.513048 0.685791 1.11938 0.685791H4.71935C4.99574 0.685791 5.23931 0.929259 5.23931 1.20751C5.23931 1.48576 4.99747 1.73096 4.71935 1.73096H1.11938C1.06755 1.73096 1.03819 1.76053 1.03819 1.8127V10.8732C1.03819 10.9253 1.06755 10.9549 1.11938 10.9549H10.1193C10.1711 10.9549 10.2005 10.9253 10.2005 10.8732V7.24898C10.2005 6.97073 10.4423 6.72726 10.7187 6.72726C10.9951 6.72726 11.2387 6.97073 11.2387 7.24898Z"
            fill="white"
          />
          <path
            d="M11.237 1.20751V4.5291C11.237 4.80735 10.9952 5.05082 10.7188 5.05082C10.4424 5.05082 10.2006 4.80735 10.2006 4.5291V2.46484L6.29832 6.39163C6.20503 6.48554 6.07893 6.53423 5.92001 6.53423C5.76108 6.53423 5.63498 6.48728 5.5417 6.39337C5.44151 6.2925 5.38623 6.16207 5.38623 6.02643C5.38623 5.89078 5.44151 5.76035 5.5417 5.65949L9.47334 1.73096H7.41942C7.14303 1.73096 6.90119 1.48749 6.90119 1.20751C6.90119 0.929259 7.14303 0.685791 7.41942 0.685791H10.7188C10.9952 0.685791 11.237 0.929259 11.237 1.20751Z"
            fill="white"
          />
        </svg>
      </Space>
    ),
    key: 'Documents',
  },
]

const Inscriptions = () => {
  const nav = useNavigate()

  const local = useLocation()

  const [tabKey, setTabKey] = useState('')

  const [, setUrlState] = useUrlState({ address: '' })

  const { setSearchText } = useInscriptionsSearchState()

  useEffect(() => {
    const localList = local.pathname.split(',')
    const tabKey = localList[localList.length - 1]
    if (tabKey === '/inscriptions') {
      setTabKey('explorer')
      return
    }
    const currentKey = tabList.find((tab) => tabKey.indexOf(tab.key) !== -1)
    if (currentKey) {
      setUrlState({})
      setTabKey(currentKey.key)
    }
  }, [local.pathname])

  const tabKeyChange = (key: string) => {
    if (key === 'Documents') {
      window.open('https://github.com/48Club/bnb-48-inscription', '_blank')
      return
    }
    setTabKey(key)
    if (key !== 'account') {
      setSearchText('')
    }
    nav(`/inscriptions/${key}`)
  }

  return (
    <div className="w-full mb-[80px] md:mb-[120px] explorer-wrap">
      <div className="w-full h-[46px] bg-[black] fixed top-[70px] z-[19]">
        <div className="px-4 max-w-6xl mx-auto ">
          <Tabs
            activeKey={tabKey}
            className="color-text-white right-move-icon hide-tabs-bottom-line"
            onChange={tabKeyChange}
            centered
            items={tabList}
            tabBarStyle={{ height: 46, marginBottom: 2 }}
            tabBarGutter={24}
            defaultActiveKey="1"
          ></Tabs>
        </div>
      </div>
      <div className="h-[46px]"></div>
      <div className="md:px-4 px-[16px] max-w-6xl mx-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default Inscriptions
