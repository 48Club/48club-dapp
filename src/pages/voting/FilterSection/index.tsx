import { DatePicker, Select, Switch } from 'antd'
import React, {useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { GovSetFilterContext, GovInfoFilterContext } from '../../../hooks/gov/useGov'
import './index.less'

const { RangePicker } = DatePicker
const { Option } = Select

export default function FilterSection() {
  const { t } = useTranslation()
  const { setRelated, setTimeRanges, setStatus } = useContext(GovSetFilterContext)
  const { related , status } = useContext(GovInfoFilterContext)
  const optionList = [
    {
      label: '全部',
      value: 'all',
    },
    {
      label: '进行中',
      value: 'Active',
    },
    {
      label: '已通过',
      value: 'Succeeded',
    },
    {
      label: '已关闭',
      value: 'Invalid',
    },
    {
      label: 'Refunded',
      value: 'Refunded',
    },
    {
      label: 'Defeated',
      value: 'Defeated',
    }
  ]

  return (
    <div className="pt-4 w-auto mb-12 flex flex-col md:flex-row md:justify-between">
      <div className="flex flex-col mb-6 md:mr-6 md:w-80">
        <span className="text-sm leading-5 mb-2 text-light-black">
          筛选时间
        </span>
        <RangePicker className="h-12 rounded border-none bg-light-white" onChange={setTimeRanges} />
      </div>
      <div className="flex md:flex-1 md:justify-between">
        <div className="flex flex-col w-full mr-6 md:w-80">
          <span className="text-sm leading-5 mb-2 text-light-black">
            提案状态
          </span>
          <Select
            defaultValue={status}
            className="w-full h-12 rounded border-none filter-select bg-light-white"
            onChange={setStatus}
          >
            {optionList.map((item) => {
              return <Option className="h-10 flex items-center" key={item.label} value={item.value}>{item.label}</Option>
            })}
          </Select>
        </div>
        <div className="shrink-0 w-20 flex flex-col" style={{ flexShrink: 0 }}>
          <span className="text-sm leading-5 mb-2 text-light-black">
            与我相关
          </span>
          <Switch
            checked={related}
            className="filter-switch w-full h-12"
            onChange={setRelated}
          />
        </div>
      </div>
    </div>
  )
}
