import { Button, Input } from 'antd'
import Tag from 'components/Tag'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'
import useStakeInfo from '../../../hooks/staking/useStakeInfo'
import { formatAmount, TEN_POW } from '@funcblock/dapp-sdk'
import useStake from '../../../hooks/staking/useStake'
import BigNumber from 'bignumber.js'
import useApprove from '../../../hooks/erc20/useApprove'
import { KogeAddress, StakingAddress } from '../../../constants/contracts'
import { useEthers, useTokenAllowance } from '@usedapp/core'
import moment from 'moment'

export default function PledgeSection() {
  const { account } = useEthers()
  const { t } = useTranslation()
  const [activeItem, setActiveItem] = useState(0)
  const [input, setInput] = useState('')
  const { myStakeBalance, decimals, unstakeTime, withdrawTime, myTokenBalance, myUnstakeBalance } = useStakeInfo()
  const { onStake, stakeLoading, onUnstake, unstakeLoading, onWithdraw, withdrawLoading } = useStake()

  const { approve, loading: approveLoading } = useApprove(KogeAddress, StakingAddress)
  const allowance = new BigNumber(useTokenAllowance(KogeAddress, account, StakingAddress)?.toString() ?? '0')
  const inputBN = useMemo(() => new BigNumber(input), [input])

  const unlockMoment = unstakeTime ? moment(unstakeTime * 1000) : undefined
  const withdrawMoment = withdrawTime ? moment(withdrawTime * 1000) : undefined
  const canUnstake = (unlockMoment && unlockMoment.isAfter(moment()))
  const canWithdraw = (withdrawMoment && withdrawMoment.isAfter(moment()))

  const onSubmit = useCallback(async () => {
    if (!inputBN.gt(0) || !decimals) {
      return
    }
    let func = [onStake, onUnstake][activeItem]
    if (canWithdraw) {
      func = onWithdraw
    }
    await func(inputBN.times(TEN_POW(decimals)))
  }, [onStake, onUnstake, onWithdraw, canWithdraw, inputBN, decimals])

  const currentBalance = useMemo(() => {
    return [myTokenBalance, myStakeBalance, myUnstakeBalance][activeItem]
  }, [myStakeBalance, myTokenBalance, activeItem])

  const onSetMax = useCallback(() => {
    const max = new BigNumber(currentBalance?.toString() ?? '0').div(TEN_POW(decimals ?? 0)).toString()
    setInput(max)
  }, [setInput, currentBalance, decimals])

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
            {formatAmount(myStakeBalance, decimals)} KOGE
          </span>
          <span className="text-sm leading-5 mb-12" style={{ color: '#54606C' }}>
            {
              canUnstake ? (
                <>Unlock Time: {unlockMoment?.format('YYYY-MM-DD HH:mm')}</>
              ) : null
            }

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
            {
              canWithdraw && (
                <div className={`py-2 px-4 font-medium text-base text-center rounded border-2 cursor-pointer ${activeItem === 2 ? 'border-yellow' : 'border-transparent'}`}
                     onClick={() => setActiveItem(2)}>
                  {t('withdraw')}
                </div>
              )
            }
          </div>
          <Input suffix={<span className="text-base text-primary cursor-pointer" onClick={onSetMax}>MAX</span>}
                 placeholder={`Balance: ${formatAmount(currentBalance, decimals)} KOGE`}
                 className="h-12 mb-6 text-base"
                 value={input}
                 onChange={(e) => setInput(e.target.value)} />

          {
            allowance.lte(0) ? (
              <Button className="h-12" onClick={approve} loading={approveLoading}>
                Approve
              </Button>
            ) : (
              <Button type='primary'
                      className="h-12"
                      onClick={onSubmit}
                      loading={stakeLoading || unstakeLoading}
                      disabled={stakeLoading || unstakeLoading || withdrawLoading || !inputBN.gt(0) || (activeItem === 1 && canUnstake)}>
                {t('confirm')}
              </Button>
            )
          }
        </div>
      </div>
    </div>
  )
}
