import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Input, Button } from 'antd'
import { useTranslation } from 'react-i18next'

export interface AddressSearchRef {
  reset: () => void
}

interface AddressSearchProps {
  onSearch?: (address: string) => void
}

const AddressSearch = forwardRef<AddressSearchRef, AddressSearchProps>(({ onSearch }, ref) => {
  const [address, setAddress] = useState('')
  const { t } = useTranslation()

  useImperativeHandle(ref, () => ({
    reset: () => setAddress('')
  }))

  const handleSearch = () => {
    if (onSearch) {
      onSearch(address)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Input
        placeholder={t('trade_race_search_placeholder')}
        value={address}
        onChange={e => setAddress(e.target.value)}
        style={{ maxWidth: 300 }}
        allowClear={true}
      />
      <Button type="primary" onClick={handleSearch}>
        {t('trade_race_search_button')}
      </Button>
    </div>
  )
})

export default AddressSearch
