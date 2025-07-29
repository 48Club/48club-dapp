import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Modal, Input, Button, message, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { isAddress } from 'ethers/lib/utils'
import { getTradeRaceAirdrop } from '@/utils/axios'
import dayjs from 'dayjs'
import { CloseOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import { useContractFunction, useEthers } from '@usedapp/core'
import { useAirDropStatusContract } from '@/hooks/useContract'

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
  // const account = '0x979a2505960917b78568752B8D05fBCeDDF11A50'
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<AirdropRecord[]>([])
  const [searched, setSearched] = useState(false)
  const airdropStatusContract = useAirDropStatusContract()
  const { send: claim, state: claimState } = useContractFunction(airdropStatusContract, 'claim', { transactionName: 'Claim Reward' })
  const isMobile = useMediaQuery({ maxWidth: 768 })
  


  useEffect(() => {
    if (account && visible) {
      setAddress(account)
    }
  }, [account, visible])
  useEffect(() => {
    if (visible) {
      getTradeRaceAirdrop({ address: account }).then((res) => {
        if (res.status === 200 && res.data.status === 200) {
          setSearchResults(res.data.data || [])
          setSearched(false)
        }
      })
    }
  }, [visible])
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
      title: t('round'),
      dataIndex: 'range',
      key: 'range',
      width: 100,
      render: (_: any, data: any) => (
        <span>#{data.nonce}</span>
      )
    },
    {
      title: t('trade.total_reward')+' KOGE',
      dataIndex: 'total_reward',
      key: 'total_reward',
      render: (_: string, data: any) => (
        <span className="font-mono">{data.total_reward}</span>
      )
    },
    {
      title: t('trade_eligible'),
      dataIndex: 'amount',
      key: 'amount',
      render: (_: string, data: any) => (
        <span className="font-mono">{data.eligible_amount}</span>
      )
    },
    {
      title: t('trade.each_reward')+' KOGE',
      dataIndex: 'amount',
      key: 'amount',
      render: (_: string, data: any) => (
        <span className="font-mono">{data.each_reward}</span>
      )
    },
    {
      title: t('isDispatch'),
      key: 'dispatch',
      render: (_: any, data: any) => {
        if (!address) {
          return '--'
        }
        if (!searched) {
          return '--'
        }
        console.log(data)
        if (!data.eligible) {
          return <span className="text-red-500">{t('not_eligible')}</span>
        }
        // 如果有 tx_hash，显示已发放
        if (data.tx_hash) {
          return <a className="text-green-500 underline break-all" href={`https://bscscan.com/tx/${data.tx_hash}`} target="_blank">{data.tx_hash}</a>
        }
        if (data.status === 1) {
          if (account?.toLowerCase() === address?.toLowerCase()) {
            return <Button type="primary" onClick={() => handleClaim(data)}>{t('claim')}</Button>
          }
          return <span className="text-orange-500">{t('can_claim')}</span>
        }
        return <span className="text-red-500">{t('wait_dispatch')}</span>
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
        setSearchResults(res.data.data || [])
        setSearched(true)
      }
    } catch (error: any) {
      if (error?.status === 404) {
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
  }

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
  }, [handleSearch])
  const handleInputChange = (e: any) => {
    setAddress(e.target.value)
    if (e.target.value === '') {
      setSearched(false)
      // getTradeRaceAirdrop({}).then((res) => {
      //   if (res.status === 200 && res.data.status === 200) {
      //     setSearchResults(res.data.data || [])
      //   }
      // })
    }
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
            onChange={handleInputChange}
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
            {/* {searchResults.length === 0 && (
              <div style={{ color: isEligible ? '#888' : '#E24C4B', padding: 24, fontWeight: isEligible ? 400 : 600 }}>
                {isEligible ? t('no_data') : t('not_eligible')}
              </div>
            )} */}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={searchResults}
            rowKey="txHash"
            loading={loading}
            pagination={false}
            scroll={{y: 300}}
            locale={{
              emptyText: <div style={{ color: '#888', padding: 24 }}>{t('no_data')}</div>
            }}
          />
        )}
      </div>
      {contextHolder}
    </Modal>
  )
}

export default AddressSearchModal 
