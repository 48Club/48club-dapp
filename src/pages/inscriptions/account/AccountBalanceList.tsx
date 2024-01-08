import {
  SearchResultList,
  useInscriptionsBetchTransferState,
  useInscriptionsLocalHashList,
  useInscriptionsSearchState,
} from '@/store'
import { shorten } from '@funcblock/dapp-sdk'
import { Spin, message } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const Row: React.FC<{
  data: SearchResultList
  click: () => void
  active: boolean
}> = ({ data, click, active }) => {
  const nav = useNavigate()

  const { localHashList, setLocalHashList } = useInscriptionsLocalHashList()

  const { betchTransferState } = useInscriptionsBetchTransferState()

  const del = () => {
    if (betchTransferState.tick_hash !== data.tick_hash) {
      const delIndex = localHashList.findIndex((i) => i.tick_hash === data.tick_hash)
      const newLocalList = [...localHashList]
      newLocalList.splice(delIndex, 1)
      setLocalHashList(newLocalList)
    } else {
      message.error('You cannot delete an already selected')
    }
  }

  const ItemNode = (
    <>
      <div className="flex-1 md:hidden text-[12px] text-[#E2B201] font-[400] leading-[24px]">
        {data.tick}{' '}
        <span className="ml-[8px] px-[6px] h-[17px] leading-[17px] font-[400] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">
          BNB-48
        </span>
        <div className="text-[10px]">({shorten(data.tick_hash)})</div>
      </div>
      <div className="flex-1 md:flex hidden text-[14px] text-[#E2B201] items-center font-[400] leading-[24px]">
        {data.tick} <span className="text-[12px]">({shorten(data.tick_hash)})</span>{' '}
        <span className="ml-[8px] px-[6px] h-[17px] leading-[17px] font-[400] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">
          BNB-48
        </span>
      </div>
      {/* <div className="flex justify-center">
            {data.decimals || '-'}
        </div> */}
      <div className="flex justify-end">{data.amount || '-'}</div>

      {/* <div className="flex-1 flex justify-end">
            {
                data.type === 'local' && <Button onClick={del} type="primary" danger className="w-[98px]">Delete</Button>
            }
        </div> */}
    </>
  )

  return (
    <>
      <div
        onClick={click}
        style={active ? { borderColor: '#FFC801', background: '#F9F9F9' } : undefined}
        className="cursor-pointer md:flex hidden px-[10px] md:px-[20px] border transition-all border-transparent rounded-[4px] hover:bg-[#f4f4f4] h-[56px] flex-row justify-between items-center text-[14px] md:text-[16px]"
      >
        {ItemNode}
      </div>
      <div
        onClick={() => {
          click()
          nav('/inscriptions/account/mobile/betch')
        }}
        className="cursor-pointer md:hidden px-[10px] md:px-[20px] border transition-all border-transparent rounded-[4px] active:bg-[#f4f4f4] h-[56px] flex flex-row justify-between items-center text-[14px] md:text-[16px]"
      >
        {ItemNode}
      </div>
    </>
  )
}

const AccountList = ({ onSearch }: { tabType: string; onSearch: any }) => {
  const { t } = useTranslation()

  const { setSelectedToken, betchTransferState } = useInscriptionsBetchTransferState()
  const { result: resultList, loading } = useInscriptionsSearchState()
  const nav = useNavigate()
  useEffect(() => {
    onSearch()
  }, [])

  return (
    <div>
      <div className="flex flex-row justify-between px-[12px] md:px-[20px] items-center leading-[24px] mb-[16px] text-[16px] font-[400]">
        <div className="flex-1 text-gray ">Token</div>

        <div className="flex-1 flex text-gray justify-end">Balance</div>
      </div>
      <Spin spinning={loading} size="large">
        {resultList.length > 0 ? (
          resultList.map((i) => {
            return (
              <Row
                active={betchTransferState.tick_hash === i.tick_hash}
                click={() => nav('/inscriptions/account/betch/' + i.tick_hash)}
                key={i.tick_hash}
                data={i}
              />
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img src="/static/staking-no-records.png" className="mb-6" alt="" />
            <span className="text-base text-gray">{t('no_records')}</span>
          </div>
        )}
      </Spin>
    </div>
  )
}

export default AccountList
