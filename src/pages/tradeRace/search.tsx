import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Modal, Input, Button, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { isAddress } from 'ethers/lib/utils'

export interface AddressSearchRef {
  open: () => void
  reset: () => void
}

interface AddressSearchProps {
  onSearch: (address: string) => void
}

const AddressSearch = forwardRef<AddressSearchRef, AddressSearchProps>(({ onSearch }, ref) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => setIsModalOpen(true),
    reset: () => {
      setAddress('')
      setIsModalOpen(false)
    }
  }))

  const handleSearch = async () => {
    if (!address) {
      message.error(t('trade_race_address_required'))
      return
    }

    try {
      // 验证地址格式
      if (!isAddress(address)) {
        message.error(t('trade_race_invalid_address'))
        return
      }

      setLoading(true)
      onSearch(address)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Search error:', error)
      message.error(t('trade_race_search_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={t('trade_race_search_title')}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width={400}
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder={t('trade_race_address_placeholder')}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onPressEnter={handleSearch}
          className="font-mono"
        />
        <Button 
          type="primary" 
          onClick={handleSearch}
          loading={loading}
          style={{ background: '#E2B201' }}
        >
          {t('trade_race_search')}
        </Button>
      </div>
    </Modal>
  )
})

export default AddressSearch
