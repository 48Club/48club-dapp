import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { formatAmount } from '@funcblock/dapp-sdk'
import useStakeInfo from '../../../hooks/staking/useStakeInfo'

export default function SummarySection() {
  const { t } = useTranslation()
  const { totalStakes, myTokenBalance, totalSupply, decimals } = useStakeInfo()

  const balancePercentage = useMemo(() => {
    if (!myTokenBalance || !totalSupply) {
      return
    }
    return myTokenBalance.times(100).div(totalSupply)
  }, [totalSupply, myTokenBalance])

  return (
    <div className="pt-4 w-auto overflow-y-visible mb-20">
      <div className="flex flex-row relative rounded-2xl" style={{ backgroundColor: '#FFFBEC' }}>
        <div className="flex flex-col pt-8 px-6 text-dark-gray w-full">
          <span className="font-bold text-4xl mb-2 text-light-black">
            {t('kogeStaking')}
          </span>
          <span className="text-sm mb-10">{t('staking_desc')}</span>
          <div className="flex flex-row w-2/3">
            <div className="flex-1 flex flex-col mb-6">
              <span className="text-sm mb-2 leading-5">
                {t('staking_summary_total')}
              </span>
              <span className="text-xl font-bold text-light-black">
                {formatAmount(totalSupply, decimals, 0)}
              </span>
            </div>
            <div className="flex-1 flex flex-col mb-6">
              <span className="text-sm mb-2 leading-5">
                {t('staking_summary_staking')}
              </span>
              <span className="text-xl font-bold text-light-black">
                {formatAmount(totalStakes, decimals)}
              </span>
            </div>
            <div className="flex-1 flex flex-col mb-6">
              <span className="text-sm mb-2 leading-5">
                {t('staking_summary_own')}
              </span>
              <span className="text-xl font-bold text-light-black">{formatAmount(balancePercentage, 0, 2)}%</span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 -bottom-5 w-48">
          <img src="/static/summary-section.png" alt="" />
        </div>
      </div>
    </div>
  )
}
