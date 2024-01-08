import { useInscriptionsSearchState } from '@/store'
import { Input, Radio, Tabs } from 'antd'
import { useState } from 'react'
import AccountList from './AccountBalanceList'
import DeploymentsList from './DeploymentsList'
type MenuTypeKey = 'ViewBalance' | 'ManageDeployments' | 'ViewDeployments'

const SelectedToken = ({ onSearch }: any) => {
  const { setSearchTextHash, searchTextHash } = useInscriptionsSearchState()

  const [menuType, setMenuType] = useState<MenuTypeKey>('ViewBalance')
  const [tabType, setTabType] = useState<string>('bnb-48')

  return (
    <div className="w-full shadow pt-[32px] pb-[32px] min-h-[600px] px-[12px]">
      <div className="diy-scrollbar px-[10px]">
        <Radio.Group className="h-[50px]" value={menuType} onChange={(val) => setMenuType(val.target.value)}>
          <Radio.Button
            value="ViewBalance"
            style={{ background: menuType === 'ViewBalance' ? '#fff' : '#E9E9E9' }}
            className=" leading-[40px] flex-1 h-[40px] text-center no-border mr-[12px]"
          >
            View Balance
          </Radio.Button>
          <Radio.Button
            value="ManageDeployments"
            style={{ background: menuType === 'ManageDeployments' ? '#fff' : '#E9E9E9' }}
            className=" leading-[40px] flex-1 h-[40px] text-center no-border"
          >
            Deployments
          </Radio.Button>
        </Radio.Group>
      </div>

      <div className="mt-[6px] pl-[12px] flex items-center justify-between">
        <Tabs
          activeKey={'bnb-48'}
          onChange={(e) => setTabType(e)}
          items={[
            {
              label: 'BNB-48',
              key: 'bnb-48',
            },
          ]}
          tabBarGutter={32}
          className="hide-tabs-bottom-line account-tab explorer-table-menu-type"
        ></Tabs>
      </div>
      <Input
        placeholder={menuType == 'ViewBalance' ? 'Enter a tick' : 'Enter a tick-hash'}
        className=" w-full rounded-[4px] mt-[32px] mb-[40px] h-full no-border bg-[#F9F9F9]"
        onChange={(val) => {
          setSearchTextHash(val.target.value)
        }}
        value={searchTextHash}
        allowClear={{
          clearIcon: (
            <svg
              className=" translate-y-[4px]"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="2" width="20" height="20" rx="11" fill="black" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.685547 11.9998C0.685547 5.76466 5.76215 0.685547 11.9998 0.685547C18.2375 0.685547 23.3141 5.76717 23.3141 12.0023C23.3141 18.2375 18.2375 23.3166 11.9998 23.3166C5.76215 23.3166 0.685547 18.235 0.685547 11.9998ZM8.13711 15.6992C8.30298 15.8651 8.52414 15.9204 8.7453 15.9204C8.96646 15.9204 9.18761 15.8651 9.35348 15.6992L11.9999 13.0503L14.6487 15.6992C14.8146 15.8651 15.0358 15.9204 15.2569 15.9204C15.4781 15.9204 15.6992 15.8651 15.8651 15.6992C16.1968 15.3675 16.1968 14.8724 15.8651 14.5407L13.1031 11.9471L15.752 9.29819C16.0837 8.96645 16.0837 8.41355 15.752 8.08181C15.4203 7.75007 14.9252 7.75007 14.5934 8.08181L11.9446 10.7307L9.29568 8.08181C8.96394 7.75007 8.46885 7.75007 8.13711 8.08181C7.80537 8.41355 7.80537 8.90864 8.13711 9.24038L10.786 11.8893L8.13711 14.5407C7.80537 14.8724 7.80537 15.3675 8.13711 15.6992Z"
                fill="#E9E9E9"
              />
            </svg>
          ),
        }}
        suffix={
          searchTextHash.length > 0 ? (
            <svg
              onClick={() => onSearch()}
              className=" cursor-pointer"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23.0271 21.6144L23.0306 21.6213C23.3407 21.9968 23.3717 22.6342 23.0961 23.0477L23.0857 23.0615L23.0754 23.0718C22.8962 23.2544 22.6516 23.344 22.3449 23.344C22.0417 23.344 21.7937 23.251 21.6145 23.0718L16.7874 18.2482C14.9372 19.6987 12.7804 20.4636 10.534 20.4636C9.21092 20.4636 7.92232 20.2018 6.70608 19.6815C5.53119 19.1819 4.47688 18.4653 3.56384 17.5557C2.65424 16.6461 1.93759 15.5883 1.438 14.4134C0.921183 13.1972 0.655884 11.9086 0.655884 10.5855C0.655884 9.26248 0.917737 7.97044 1.438 6.7473C1.93759 5.56552 2.65424 4.50432 3.56384 3.58783C4.47343 2.67135 5.53119 1.9478 6.70264 1.44477C7.92232 0.921061 9.21092 0.655762 10.534 0.655762C11.857 0.655762 13.1456 0.917615 14.3653 1.43788C15.5402 1.93747 16.5945 2.65412 17.5075 3.56372C18.4206 4.47331 19.1338 5.53106 19.6334 6.70596C20.1502 7.9222 20.4155 9.2108 20.4155 10.5338C20.4155 12.8699 19.6299 15.0818 18.2035 16.7908L23.0271 21.6144ZM2.66458 10.5855C2.66458 14.9233 6.19271 18.4549 10.534 18.4549C14.8718 18.4549 18.4034 14.9268 18.4034 10.5855C18.4034 6.24425 14.8718 2.71612 10.534 2.71612C6.19616 2.71612 2.66458 6.2477 2.66458 10.5855Z"
                fill="#FFC801"
              />
            </svg>
          ) : (
            <svg
              onClick={() => onSearch()}
              className=" cursor-pointer"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23.027 21.6144L23.0305 21.6213C23.3406 21.9968 23.3716 22.6342 23.0959 23.0477L23.0856 23.0615L23.0753 23.0718C22.8961 23.2544 22.6515 23.344 22.3448 23.344C22.0416 23.344 21.7936 23.251 21.6144 23.0718L16.7873 18.2482C14.9371 19.6987 12.7803 20.4636 10.5338 20.4636C9.2108 20.4636 7.9222 20.2018 6.70596 19.6815C5.53106 19.1819 4.47676 18.4653 3.56371 17.5557C2.65412 16.6461 1.93747 15.5883 1.43788 14.4134C0.921061 13.1972 0.655762 11.9086 0.655762 10.5855C0.655762 9.26248 0.917615 7.97044 1.43788 6.7473C1.93747 5.56552 2.65412 4.50432 3.56371 3.58783C4.47331 2.67135 5.53106 1.9478 6.70251 1.44477C7.9222 0.921061 9.2108 0.655762 10.5338 0.655762C11.8569 0.655762 13.1455 0.917615 14.3652 1.43788C15.5401 1.93747 16.5944 2.65412 17.5074 3.56372C18.4205 4.47331 19.1337 5.53106 19.6333 6.70596C20.1501 7.9222 20.4154 9.2108 20.4154 10.5338C20.4154 12.8699 19.6298 15.0818 18.2034 16.7908L23.027 21.6144ZM2.66446 10.5855C2.66446 14.9233 6.19259 18.4549 10.5338 18.4549C14.8717 18.4549 18.4032 14.9268 18.4032 10.5855C18.4032 6.24425 14.8717 2.71612 10.5338 2.71612C6.19604 2.71612 2.66446 6.2477 2.66446 10.5855Z"
                fill="black"
              />
            </svg>
          )
        }
      />
      {/* </AutoComplete> */}
      {menuType === 'ViewBalance' && <AccountList tabType={tabType} onSearch={onSearch} />}
      {menuType === 'ManageDeployments' && <DeploymentsList tabType={tabType} />}
    </div>
  )
}

export default SelectedToken
