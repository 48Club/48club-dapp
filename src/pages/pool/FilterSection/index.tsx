import React from 'react'
import { DatePicker, Select, Input } from 'antd'
import { useTranslation } from 'react-i18next'

const { RangePicker } = DatePicker
const { Option } = Select

export const FilterSection = () => {
  const { t } = useTranslation()

  const optionList = [
    {
      label: t('all'),
      value: 'all',
    },
    {
      label: t('active'),
      value: 'Active',
    },
    {
      label: t('succeeded'),
      value: 'Succeeded',
    },
    {
      label: t('invalid'),
      value: 'Invalid',
    },
    {
      label: t('refunded'),
      value: 'Refunded',
    },
    {
      label: t('defeated'),
      value: 'Defeated',
    },
  ]

  return (
    <div className="pt-4 w-auto mb-12 flex flex-col md:flex-row md:justify-between">
      <div className="flex flex-col mb-6 md:mr-6 md:w-80">
        <span className="text-sm leading-5 mb-2 text-light-black">{t('pool_filter_name')}</span>
        <Input className="h-12 rounded border-none bg-light-white" />
      </div>
      <div className="flex flex-col mb-6 md:mr-6 md:w-80">
        <span className="text-sm leading-5 mb-2 text-light-black">{t('filter_time')}</span>
        <RangePicker className="h-12 rounded border-none bg-light-white" />
      </div>
      <div className="flex md:flex-1 md:justify-between">
        <div className="flex flex-col w-full mr-6 md:w-80">
          <span className="text-sm leading-5 mb-2 text-light-black">{t('pool_filter_status')}</span>
          <Select className="w-full h-12 rounded border-none filter-select bg-light-white">
            {optionList.map((item) => (
              <Option className="h-10 flex items-center" key={item.label} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}