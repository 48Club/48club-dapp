import React, { useState, useMemo, useCallback } from 'react'
import { Button, Modal, ModalProps, Input } from 'antd'
import BigNumber from 'bignumber.js'
import { useTokenBalance, useEthers } from '@usedapp/core'
import { useTranslation } from 'react-i18next'
import { usePool, usePoolInfo } from '../../../hooks/pool/usePool'
import { TEN_POW } from '@funcblock/dapp-sdk'
import { useStakeOrClaim, useStakeShow } from '../../../store'

export const StakeOrClaimModal = (props: Pick<ModalProps, 'visible' | 'onCancel'>) => {
  const { t } = useTranslation()
  const { currentType, curAddress } = useStakeOrClaim()
  const [amount, setAmount] = useState('')
  const [isMax, setMax] = useState(false)
  const amountBN = useMemo(() => new BigNumber(amount).times(TEN_POW(18)), [amount])
  const { account } = useEthers()
  const [_, hideModal] = useStakeShow()
  const {
    stakePoolLoading,
    onStakePool,
    stakeTokenSymbol,
    stakeToken,
    onWithdraw,
    withdrawLoading,
    onWithdrawAll,
    withdrawAllLoading,
    onExit,
    exitLoading,
  } = usePool(curAddress || '')
  const stakeBalance = useTokenBalance(stakeToken, account)
  const stakeAmount = useTokenBalance(curAddress, account)
  const { rewardTokenSymbol } = usePoolInfo(curAddress)

  const handleStakePool = useCallback(async () => {
    if (!stakePoolLoading && amountBN.gt(0) && amountBN.lt(new BigNumber(stakeBalance?.toString() || ''))) {
      await onStakePool(amountBN)
      hideModal(false)
      setAmount('')
    }
  }, [stakePoolLoading, amountBN, stakeBalance, onStakePool, hideModal])

  const handleWithdraw = useCallback(async () => {
    if (!amountBN.gt(new BigNumber(stakeAmount?.toString() ?? ''))) {
      if (isMax) {
        await onWithdrawAll()
      } else {
        await onWithdraw(amountBN)
      }
      hideModal(false)
      setAmount('')
    }
  }, [amountBN, hideModal, isMax, onWithdraw, onWithdrawAll, stakeAmount])

  const stakeMax = useCallback(async () => {
    setMax(true)
    if (currentType === 1) {
      setAmount(new BigNumber(stakeBalance?.toString() ?? '').div(TEN_POW(18)).toString())
    } else {
      setAmount(new BigNumber(stakeAmount?.toString() ?? '').div(TEN_POW(18)).toString())
    }
  }, [currentType, stakeAmount, stakeBalance])

  return (
    <Modal {...props} footer={false} closeIcon={null} className="rounded-xl" destroyOnClose>
      <div className="p-6 rounded-xl">
        <div className="relative pt-4 text-center text-[#1E1E1E] text-xl font-bold">
          {currentType === 1 ? t('pool_pledge') : t('pool_unpledge')}
          <img
            src="/static/close.svg"
            className="absolute top-0 right-0 transform -translate-y-1/2 cursor-pointer"
            alt=""
            onClick={props.onCancel}
          />
        </div>
        <div className="mt-6 flex gap-11">
          <div className="flex-1 flex flex-col gap-3">
            <span>{t('pool_staking_currency')}</span>
            <Input
              value={stakeTokenSymbol ?? ''}
              readOnly
              size="large"
              className="h-12 border-none rounded bg-light-white"
            />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <span>{t('pool_reward_currency')}</span>
            <Input
              value={rewardTokenSymbol}
              readOnly
              size="large"
              className="h-12 border-none rounded bg-light-white"
            />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <span>{currentType === 1 ? t('pool_staking_amount') : t('pool_un_staking_amount')}</span>
          <Input
            value={amount}
            type="number"
            size="large"
            className="h-12 border-none rounded bg-light-white font-500"
            onChange={(e) => {
              setAmount(e.target.value)
            }}
            placeholder={
              currentType === 1
                ? `${t('pool_balance')}: ${new BigNumber(stakeBalance?.toString() ?? '')
                    .div(TEN_POW(18))
                    .toString()} ${stakeTokenSymbol}`
                : `${t('pool_staking_amount')}: ${new BigNumber(stakeAmount?.toString() ?? '')
                    .div(TEN_POW(18))
                    .toString()} ${stakeTokenSymbol}`
            }
            suffix={
              <span className="text-primary text-sm font-bold cursor-pointer" onClick={stakeMax}>
                MAX
              </span>
            }
          />
        </div>
        <div className="mt-8 w-full flex justify-center">
          {currentType === 1 && (
            <Button
              disabled={!amountBN.gt(0)}
              type="primary"
              size="large"
              className="w-50 h-12 rounded"
              onClick={handleStakePool}
              loading={stakePoolLoading}
            >
              {t('pool_confirm')}
            </Button>
          )}
          {currentType === 2 && (
            <Button
              disabled={!amountBN.gt(0) || !new BigNumber(stakeAmount?.toString() ?? '').gt(0)}
              type="primary"
              size="large"
              className="w-50 h-12 rounded"
              onClick={handleWithdraw}
              loading={withdrawLoading || withdrawAllLoading || exitLoading}
            >
              {t('pool_confirm')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
