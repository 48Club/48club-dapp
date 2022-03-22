import { Button, Input, Tooltip } from 'antd'
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
import { useOpenModal } from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/actions'
import { HelpCircle } from 'react-feather'

export default function StakingSection() {
  const { account } = useEthers()
  const { t } = useTranslation()
  const [activeItem, setActiveItem] = useState(0)
  const [input, setInput] = useState('')
  const { myStakeBalance, decimals, unstakeTime, withdrawTime, myTokenBalance, myUnstakeBalance } = useStakeInfo()
  const { onWithdraw, withdrawLoading } = useStake()

  const { approve, loading: approveLoading } = useApprove(KogeAddress, StakingAddress)
  const allowance = new BigNumber(useTokenAllowance(KogeAddress, account, StakingAddress)?.toString() ?? '0')
  const inputBN = useMemo(() => new BigNumber(input), [input])

  const unlockMoment = unstakeTime ? moment(unstakeTime * 1000) : undefined
  const withdrawMoment = withdrawTime ? moment(withdrawTime * 1000) : undefined
  const canUnstake = (unlockMoment && unlockMoment.isBefore(moment()))
  const canWithdraw = (withdrawMoment && withdrawMoment.isBefore(moment()))
  const openStakeModal = useOpenModal(ApplicationModal.STAKE, inputBN.toString())
  const openUnstakeModal = useOpenModal(ApplicationModal.UNSTAKE, inputBN.toString())

  const onSubmit = useCallback(async () => {
    if (!inputBN.gt(0) || !decimals) {
      return
    }
    let func = [openStakeModal, openUnstakeModal, onWithdraw][activeItem]
    await func(inputBN.times(TEN_POW(decimals)))
  }, [onWithdraw, inputBN, decimals, activeItem, openStakeModal, openUnstakeModal])

  const currentBalance = useMemo(() => {
    return [myTokenBalance, myStakeBalance, myUnstakeBalance][activeItem]
  }, [myStakeBalance, myTokenBalance, activeItem, myUnstakeBalance])

  const onSetMax = useCallback(() => {
    const max = new BigNumber(currentBalance?.toString() ?? '0').div(TEN_POW(decimals ?? 0)).toString()
    setInput(max)
  }, [setInput, currentBalance, decimals])

  return (
    <div className="flex flex-col">
      <Label text={t('staking_staking_title')} />
      <div className="mt-6 w-auto flex flex-row rounded-lg shadow">
        <div className="flex-1 flex flex-col pl-8 bg-card-yellow">
          <div>
            <div className="font-medium text-base mr-3 mt-10 mb-4">
              {t('my_staking_count')}
            </div>
            <div className="text-2xl font-bold mb-4">
              {formatAmount(myStakeBalance, decimals)} KOGE
            </div>
          </div>
          <div className="flex flex-row items-center text-sm mt-6 mb-4">
            <div>
              <div className="font-medium mb-1 mr-10">
                {t('my_unstaking_count')}
              </div>
              <div className="flex flex-row items-center">
                {formatAmount(canWithdraw ? 0 : myUnstakeBalance, decimals)} KOGE
                {
                  !canWithdraw && (
                    <Tooltip placement="bottom"
                             className="ml-1"
                             title={(withdrawMoment && !canWithdraw) ? `Withdrawable: ${withdrawMoment.format('YYYY-MM-DD HH:mm')}` : undefined}
                    >
                      <HelpCircle size={16} />
                    </Tooltip>
                  )
                }
              </div>
            </div>
            <div>
              <div className="font-medium mb-1">
                {t('my_withdrawable_count')}
              </div>
              <div className="">
                {formatAmount(canWithdraw ? (myUnstakeBalance ?? 0) : 0, decimals)} KOGE
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-6 mb-20">
          <div className="flex flex-row mt-10 mb-6">
            <div className={`py-2 px-4 font-medium text-base text-center rounded border-2 cursor-pointer ${activeItem === 0 ? 'border-yellow' : 'border-transparent'}`}
                 onClick={() => setActiveItem(0)}>
              {t('staking')}
            </div>
            <div className={`py-2 px-4 font-medium text-base text-center rounded border-2 cursor-pointer ${activeItem === 1 ? 'border-yellow' : 'border-transparent'}`}
                 onClick={() => setActiveItem(1)}>
              {t('unstake')}
            </div>
            <div className={`py-2 px-4 font-medium text-base text-center rounded border-2 cursor-pointer ${activeItem === 2 ? 'border-yellow' : 'border-transparent'}`}
                 onClick={() => setActiveItem(2)}>
              {t('withdraw')}
            </div>
          </div>
          <div className="flex flex-row justify-between h-12">
            <Input suffix={<span className="text-base text-primary cursor-pointer" onClick={onSetMax}>MAX</span>}
                   placeholder={`${t('balance')}: ${formatAmount(currentBalance, decimals)} KOGE`}
                   className="h-12 mb-6 text-base mr-6 bg-white"
                   value={input}
                   onChange={(e) => setInput(e.target.value)} />
            {
              !allowance.gt(0) ? (
                <Button className="h-12 rounded" onClick={approve} loading={approveLoading}>
                  Approve
                </Button>
              ) : (
                <Tooltip placement="top"
                         title={
                           (activeItem === 1 && account && !canUnstake) ? `Unlock Time: ${unlockMoment?.format('YYYY-MM-DD HH:mm')}` : undefined
                         }>
                  <Button type="primary"
                          className="h-full rounded"
                          onClick={onSubmit}
                          loading={withdrawLoading}
                          disabled={withdrawLoading || !inputBN.gt(0) || (activeItem === 1 && !canUnstake)}>
                    {t('confirm')}
                  </Button>
                </Tooltip>
              )
            }
          </div>

        </div>
      </div>
    </div>
  )
}
