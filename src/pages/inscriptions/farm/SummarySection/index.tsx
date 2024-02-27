import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { formatAmount } from '@funcblock/dapp-sdk'
// import useStakeInfo from '../../../hooks/staking/useStakeInfo'

export default function InscriptionSummarySection() {
  const { t } = useTranslation()
  // const { totalStakes, myStakeBalance, totalSupply, decimals } = useStakeInfo()

  const balancePercentage = useMemo(() => {
    // if (!myStakeBalance || !totalSupply) {
    //   return
    // }
    // return myStakeBalance.times(100).div(totalSupply)
    1
  }, [])

  return (
    <div className="pt-4 w-auto overflow-y-visible mb-20">
      <div className="flex flex-row relative rounded-2xl" style={{ backgroundColor: '#FFFBEC' }}>
        <div className="flex flex-col pt-8 px-6 text-dark-gray w-full">
          <span className="font-bold text-4xl mb-2 text-light-black">Ikoge Staking</span>
          <span className="text-sm mb-10">Stake IKOGE Get rewards.</span>
          <div className="flex flex-col md:flex-row w-2/3">
            {/* <div className="flex-1 flex flex-col mb-6">
              <span className="text-sm mb-2 leading-5">{t('staking_summary_total')}</span>
              <span className="text-xl font-bold text-light-black">{formatAmount(1, 1, 0)}</span>
            </div> */}
            <div className="flex-1 flex flex-col mb-6">
              <span className="text-sm mb-2 leading-5">{t('staking_summary_staking')}</span>
              <span className="text-xl font-bold text-light-black">{formatAmount(1, 1, 0)}</span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 -bottom-5 w-48">
          <img src="/static/summary-section.png" style={{ width: '100%' }} alt="" />
        </div>
      </div>
    </div>
  )
}
