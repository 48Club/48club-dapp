import { Button, Input } from 'antd'
import Tag from 'components/Tag'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'

import './index.less'
import { useEthers } from '@usedapp/core'
import useStakeInfo from '../../../hooks/staking/useStakeInfo'
import { formatAmount } from '@funcblock/dapp-sdk'

export default function PledgeSection() {
  const { t } = useTranslation()
  const { account } = useEthers()
  const { myStake, decimals, unlockTime } = useStakeInfo()

  const inputMax = (
    <div className="text-sm" style={{ color: '#FFC801' }}>
      MAX
    </div>
  )
  return (
    <div className="flex flex-col">
      <Label text={t('staking_pledge_title')} />
      <div className="mt-6 w-auto flex flex-row rounded-lg shadow">
        <div className="flex-1 flex flex-col pl-8 text-light-black" style={{ backgroundColor: '#FFFBEC' }}>
          <div className="flex flex-row mt-10 mb-4 ">
            <div className="font-medium text-base mr-3 leading-7">
              {t('my_pledge_count')}
            </div>
            <Tag type="doing" />
          </div>
          <span className="text-2xl font-bold mb-4 leading-7">
            {formatAmount(myStake, decimals)} KOGE
          </span>
          <span className="text-sm leading-5 mb-12" style={{ color: '#54606C' }}>
            解质押时间：{unlockTime ?? 'NONE'}
          </span>
        </div>
        <div className="flex-1 flex flex-col px-6 mb-20">
          <div className="flex flex-row mt-10 mb-6">
            <div className="py-2 px-4 font-medium text-base text-center active">
              {t('pledge')}
            </div>
            <div className="py-2 px-4 font-medium text-base text-center">
              {t('release_pledge')}
            </div>
          </div>
          <Input suffix={inputMax} className="h-12 mb-6" />
          <Button
            className="h-12 text-sm text-light-black bg-yellow rounded font-medium"
          >
            {t('confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
