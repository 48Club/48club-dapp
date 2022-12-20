import React from 'react'
import { DatePicker, Select, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { usePoolFilter } from '../../../store'
import { STAKING_WHITELIST, TOKENS } from '../../../constants/tokens'

const { RangePicker } = DatePicker
const { Option } = Select

export const FilterSection = () => {
  const { t } = useTranslation()
  const { filterDetail, setFilterDetail } = usePoolFilter()

  const optionList = [
    {
      label: t('all'),
      value: -1,
    },
    {
      label: t('pool_coming').replace(' soon', ''),
      value: 0,
    },
    {
      label: t('pool_ongoing'),
      value: 1,
    },
    {
      label: t('pool_closed'),
      value: 2,
    },
  ]

  const stakingOptions = STAKING_WHITELIST.map((i) => ({
    label: TOKENS[i],
    value: i,
  })).concat([
    {
      label: t('all'),
      value: '',
    },
  ])

  return (
    <div className="pt-4 w-auto mb-12 flex flex-col md:flex-row md:justify-start">
      <div className="flex flex-col mb-6 md:mr-6 md:w-80 hidden">
        <span className="text-sm leading-5 mb-2 text-light-black">{t('pool_filter_name')}</span>
        <Input className="h-12 rounded border-none bg-light-white" />
      </div>
      <div className="flex flex-col mb-6 md:mr-6 md:w-80 hidden">
        <span className="text-sm leading-5 mb-2 text-light-black">{t('filter_time')}</span>
        <RangePicker className="h-12 rounded border-none bg-light-white" />
      </div>
      <div className="flex flex-col w-full mr-5 md:w-80">
        <span className="text-sm leading-5 mb-2 text-light-black">{t('pool_filter_status')}</span>
        <Select
          className="w-full h-12 rounded border-none filter-select bg-light-white"
          placeholder={t('pool_select')}
          onChange={(e) => {
            setFilterDetail((detail) => ({ ...detail, status: e }))
          }}
        >
          {optionList.map((item) => (
            <Option className="h-10 flex items-center" key={item.label} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col w-full mr-5 md:w-80">
        <span className="text-sm leading-5 mb-2 text-light-black">{t('pool_staking_currency')}</span>
        <Select
          className="w-full h-12 rounded border-none filter-select bg-light-white"
          placeholder={t('pool_select')}
          onChange={(e) => {
            setFilterDetail((detail) => ({ ...detail, stakeAddress: e }))
          }}
        >
          {stakingOptions.map((item) => (
            <Option className="h-10 flex items-center" key={item.label} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  )
}
