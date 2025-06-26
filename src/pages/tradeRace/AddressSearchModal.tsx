import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Modal, Input, Button, message, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { isAddress } from 'ethers/lib/utils'
import { getTradeRaceAirdrop } from '@/utils/axios'
import dayjs from 'dayjs'
import { CloseOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import { useContractFunction, useEthers } from '@usedapp/core'
import { useAirDropStatusContract, useAirDropStatusContractReadonly } from '@/hooks/useContract'

interface AddressSearchModalProps {
  visible: boolean
  onClose: () => void
}

interface AirdropRecord {
  amount: string
  range: number[]
  tx_hash: string
  address?: string
}

const AddressSearchModal: React.FC<AddressSearchModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation()
  const { account } = useEthers()
  const [messageApi, contextHolder] = message.useMessage();
  // const account = '0xE023AA810Aa868751ba11B590208a13A1a1a10f4'
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<AirdropRecord[]>([])
  const [isEligible, setIsEligible] = useState(true)
  const [contractResults, setContractResults] = useState<any[]>([])
  const airdropStatusContractReadonly = useAirDropStatusContractReadonly()
  const airdropStatusContract = useAirDropStatusContract()
  const { send: claim, state: claimState } = useContractFunction(airdropStatusContract, 'claim', { transactionName: 'Claim Reward' })
  const isMobile = useMediaQuery({ maxWidth: 768 })
  // 统一监听所有状态
   const handleStateChange = useCallback((state: any, actionName: string) => {
    console.log(state, 'state')
    if (state.status === 'Success') {
      handleSearch()
    } else if (state.status === 'Exception' || state.status === 'Fail') {
      messageApi.error({
        type: 'error',
        content: state.errorMessage,
      })
    }
  }, [])
  // 获取所有没有 tx_hash 的记录
  const recordsWithoutTxHash = useMemo(() => {
    return searchResults.filter((item) => !item.tx_hash)
  }, [searchResults])

  // 直接调用合约方法
  const fetchContractResults = async () => {
    try {
      recordsWithoutTxHash.map(async (item) => {
        try {
          // 根据 ABI，getAirdropStatus 需要 eventID 和 user 参数
          // item.range[0] 应该是 eventID
          const result = await airdropStatusContractReadonly.getAirdropStatus(item.range[0], address)
          console.log(`Contract result for eventID ${item.range[0]}:`, result)
          setContractResults(prev => ({ ...prev, [item.range[0]]: result }))
          return result
        } catch (error) {
          setContractResults(prev => ({ ...prev, [item.range[0]]: null }))
          return null
        }
      })
    } catch (error) {
      console.error('Error fetching contract results:', error)
    }
  }

  // 当地址或记录变化时重新获取结果
  useEffect(() => {
    fetchContractResults()
  }, [searchResults])
    // 监听所有状态变化
  useEffect(() => {
    handleStateChange(claimState, 'Claim Reward')
  }, [claimState.status, claimState.errorMessage])
  const handleClaim = async (data: any) => {
    try {
      console.log(data, 'data')
      // TODO: 实现领取逻辑
      await claim(data.range[0])
    } catch (error) {
      message.error(error?.toString())
      console.error('Error claiming:', error)
    }
  }
  
  const columns = [
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (_: string, data: any) => (
        <span className="font-mono">{data.amount} KOGE</span>
      )
    },
    {
      title: t('time'),
      dataIndex: 'range',
      key: 'range',
      render: (_: any, data: any) => (
        <span>{dayjs(data.range[0] * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      title: t('isDispatch'),
      key: 'dispatch',
      render: (_: any, data: any) => {
        // 如果有 tx_hash，显示已发放
        if (data.tx_hash) {
          return <a className="text-green-500 underline break-all" href={`https://bscscan.com/tx/${data.tx_hash}`} target="_blank">{data.tx_hash}</a>
        }
        if (contractResults[data.range[0]]) {
          const [token, amount, claimed, isExist] = contractResults[data.range[0]]
          if (claimed) {
            return <span className="text-green-500">{t('claimed')}</span>
          }
          if (isExist) {
            if (account?.toLowerCase() === address?.toLowerCase()) {
              return <Button type="primary" onClick={() => handleClaim(data)}>{t('claim')}</Button>
            }
            return <span className="text-orange-500">{t('can_claim')}</span>
          }
          return <span className="text-red-500">{t('not_eligible')}</span>
        }
        return <span className="text-gray-500">{t('error')}</span>
      }
    }
  ]

  const handleSearch = async () => {
    if (!address) {
      message.error(t('address_required'))
      return
    }

    try {
      // 验证地址格式
      if (!isAddress(address)) {
        message.error(t('invalid_address'))
        return
      }

      setLoading(true)
      const res = await getTradeRaceAirdrop({ address })
      if (res.status === 200 && res.data.status === 200) {
        setIsEligible(true)
        setSearchResults(res.data.data || [])
        // setSearchResults([
        //   {
        //     "amount": "0.18986511676003673",
        //     "range": [1748822400, 1749427200],
        //     "tx_hash": "0x57dd8ba85920143ddb0a2f1137ab69475b5e468efa32f1c06b1e63a318af7a88"
        //   },
        //   {
        //     "amount": "0.026694762593112032",
        //     "range": [1750032000, 1750636800],
        //     "tx_hash": ""
        //   },
        //   {
        //     "amount": "0.016694762593112032",
        //     "range": [1750636800,1751241600],
        //     "tx_hash": ""
        //   }

        // ])
      }
    } catch (error: any) {
      if (error?.status === 404) {
        setIsEligible(false)
        setSearchResults([])
        return
      }
      message.error(t('search_error'))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setAddress('')
    setSearchResults([])
    onClose()
    setIsEligible(true)
  }
  
  return (
    <Modal
      title={t('search_address')}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={800}
      centered
      closable={true}
      closeIcon={<CloseOutlined style={{ color: '#000' }} />}
      onClose={handleClose}
      className="address-search-modal"
      styles={{
        header: {
          padding: '20px 20px 0 20px',
          margin: 0,
        },
      }}
    >
      <div className="flex flex-col gap-4 p-[20px]">
        <div style={{ color: '#888', fontSize: 12 }}>
          {t('search_address_tip')}
        </div>
        <div className="flex gap-4">
          <Input
            placeholder={t('enter_address')}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              if (e.target.value === '') {
                setSearchResults([])
                setIsEligible(true)
              }
            }}
            onPressEnter={handleSearch}
            className="font-mono"
            autoFocus
            allowClear
          />
          <Button 
            type="primary" 
            onClick={handleSearch}
            loading={loading}
            style={{ background: '#E2B201' }}
          >
            {t('search')}
          </Button>
        </div>

        {isMobile ? (
          <div>
            {searchResults.map((item, idx) => (
              <div key={idx} style={{
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                marginBottom: 12,
                padding: 16,
                background: '#fff'
              }}>
                {
                  columns.map((column, idx) => (
                    <div key={idx} style={{ fontWeight: 500, color: '#333', marginBottom: 8 }}>
                      {column.title}：{column.render('', item)}
                    </div>
                  ))
                }
              </div>
            ))}
            {searchResults.length === 0 && (
              <div style={{ color: isEligible ? '#888' : '#E24C4B', padding: 24, fontWeight: isEligible ? 400 : 600 }}>
                {isEligible ? t('no_data') : t('not_eligible')}
              </div>
            )}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={searchResults}
            rowKey="txHash"
            loading={loading}
            pagination={false}
            locale={{
              emptyText: isEligible
                ? <div style={{ color: '#888', padding: 24 }}>{t('no_data')}</div>
                : <div style={{ color: '#E24C4B', padding: 24, fontWeight: 600 }}>{t('not_eligible')}</div>
            }}
          />
        )}
      </div>
      {contextHolder}
    </Modal>
  )
}

export default AddressSearchModal 