import { Button, Input } from 'antd'
import Tag from 'components/Tag'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'
import useStakeInfo from '../../../hooks/staking/useStakeInfo'
import { formatAmount } from '@funcblock/dapp-sdk'
import useStake from '../../../hooks/staking/useStake'
import BigNumber from 'bignumber.js'

export default function PledgeSection() {
  const { t } = useTranslation()
  const [activeItem, setActiveItem] = useState(0)
  const [input, setInput] = useState('')
  const { myStake, decimals, unlockTime, tokenBalance } = useStakeInfo()
  const { onStake, onUnstake, stakeLoading, unstakeLoading } = useStake()

  const onSubmit = useCallback(async () => {
    const inputBN = new BigNumber(input)
    if (inputBN.isNaN()) {
      return
    }
    const func = [onStake, onUnstake][activeItem]
    await func(inputBN)
  }, [onStake, onUnstake, input])

  return (
    <div className="flex flex-col">
      <Label text={t('staking_pledge_title')} />
      <div className="mt-6 w-auto flex flex-row rounded-lg shadow">
        <div className="flex-1 flex flex-col pl-8 text-light-black bg-card-yellow">
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
            Unlock Time: {unlockTime ?? 'NONE'}
          </span>
        </div>
        <div className="flex-1 flex flex-col px-6 mb-20">
          <div className="flex flex-row mt-10 mb-6">
            <div className={`py-2 px-4 font-medium text-base text-center rounded border-2 cursor-pointer ${activeItem === 0 ? 'border-yellow' : 'border-transparent'}`}
                 onClick={() => setActiveItem(0)}>
              {t('pledge')}
            </div>
            <div className={`py-2 px-4 font-medium text-base text-center rounded border-2 cursor-pointer ${activeItem === 1 ? 'border-yellow' : 'border-transparent'}`}
                 onClick={() => setActiveItem(1)}>
              {t('release_pledge')}
            </div>
          </div>
          <Input suffix={<span className="text-sm text-primary cursor-pointer">MAX</span>}
                 className="h-12 mb-6"
                 onChange={(e) => setInput(e.target.value)} />
          <div>Balance: {formatAmount(tokenBalance, decimals)} KOGE</div>
          <Button
            className="h-12 text-sm text-light-black bg-yellow rounded font-medium"
            onClick={onSubmit}
          >
            {t('confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
