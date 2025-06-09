import React, { useState } from 'react'
import { Modal, Input, Button, message, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { isAddress } from 'ethers/lib/utils'
import { getTradeRaceAirdrop } from '@/utils/axios'
import dayjs from 'dayjs'
import { CloseOutlined } from '@ant-design/icons'
import useAirDrop from '@/hooks/gov/useAirDrop'
import Bignumber from 'bignumber.js'
import { useMediaQuery } from 'react-responsive'

interface AddressSearchModalProps {
  visible: boolean
  onClose: () => void
}

interface AirdropRecord {
  amount: string
  range: number[]
}

const AddressSearchModal: React.FC<AddressSearchModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<AirdropRecord[]>([])
  const [isEligible, setIsEligible] = useState(true)
  const { airdropList, loadAirdropEvent } = useAirDrop()
  const formatNumberFull = (num: string | number) => {
    const [int, dec] = String(num).split('.')
    return (
      Number(int).toLocaleString('en-US') +
      (dec ? '.' + dec : '')
    )
  }
  const isMobile = useMediaQuery({ maxWidth: 768 })

  const columns = [
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (_: string, data: any) => (
        <span className="font-mono">{Bignumber(data.amount).div(100).toString()} KOGE</span>
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
        const isDispatch = (airdropList || []).find((item: any) => +item.eventID === data.range[0] && item.recipient === address)
        return isDispatch ? <span className="text-green-500">{t('yes')}</span> : <span className="text-red-500">{t('no')}</span>
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
      loadAirdropEvent(address)
      const res = await getTradeRaceAirdrop({ address })
      console.log(res, 'res')
      if (res.status === 200 && res.data.status === 200) {
        // const data = [
        //   {
        //     range: [
        //       1748822400,
        //       1749427200
        //     ],
        //     amount: "12"
        //   },
        // ]
        setIsEligible(true)
        setSearchResults(res.data.data || [])
      } else {
        message.error(res.data.message || t('search_error'))
      }
    } catch (error) {
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
        <div style={{ color: '#888', fontSize: 12 }}>
          {t('search_address_tip2')}
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
                <div style={{ fontWeight: 500, color: '#333', marginBottom: 8 }}>
                  {t('amount')}：<span className="font-mono">{formatNumberFull(item.amount / 100)} KOGE</span>
                </div>
                <div style={{ color: '#333', marginBottom: 8 }}>
                  {t('time')}：{dayjs(item.range[0] * 1000).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                <div style={{ color: '#333' }}>
                  {t('isDispatch')}：{(airdropList || []).find((a: any) => +a.eventID === item.range[0] && a.recipient === address)
                    ? <span className="text-green-500">{t('yes')}</span>
                    : <span className="text-red-500">{t('no')}</span>
                  }
                </div>
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
    </Modal>
  )
}

export default AddressSearchModal 