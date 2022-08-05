import React, { useState, useMemo, useCallback } from 'react'
import { Button, Modal, ModalProps, Input } from 'antd'
import BigNumber from 'bignumber.js'
import { useTokenBalance, useEthers } from '@usedapp/core'
import { usePool, usePoolInfo } from '../../../hooks/pool/usePool'
import { formatAmount, TEN_POW } from '@funcblock/dapp-sdk'
import { useStakeOrClaim, useStakeShow } from '../../../store'

export const StakeOrClaimModal = (props: Pick<ModalProps, 'visible' | 'onCancel'>) => {
  const { currentType, curAddress } = useStakeOrClaim()
  const [amount, setAmount] = useState('')
  const amountBN = useMemo(() => new BigNumber(amount).times(TEN_POW(18)), [amount])
  const { account } = useEthers()
  const [_, hideModal] = useStakeShow()
  const {
    stakePoolLoading,
    onStakePool,
    stakeTokenSymbol,
    stakeTokenAddress,
    onWithdraw,
    withdrawLoading,
    onWithdrawAll,
    withdrawAllLoading,
    onExit,
    exitLoading,
  } = usePool(curAddress || '')
  const stakeBalance = useTokenBalance(stakeTokenAddress, account)
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
      await onWithdraw(amountBN)
      hideModal(false)
      setAmount('')
    }
  }, [amountBN, hideModal, onWithdraw, stakeAmount])

  const stakeMax = useCallback(async () => {
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
          {currentType === 1 ? '' : '解'}质押代币
          <img
            src="/static/close.svg"
            className="absolute top-0 right-0 transform -translate-y-1/2 cursor-pointer"
            alt=""
            onClick={props.onCancel}
          />
        </div>
        <div className="mt-6 flex gap-11">
          <div className="flex-1 flex flex-col gap-3">
            <span>质押币种</span>
            <Input
              value={stakeTokenSymbol ?? ''}
              readOnly
              size="large"
              className="h-12 border-none rounded bg-light-white"
            />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <span>奖励币种</span>
            <Input
              value={rewardTokenSymbol}
              readOnly
              size="large"
              className="h-12 border-none rounded bg-light-white"
            />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <span>{currentType === 1 ? '' : '解'}质押数量</span>
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
                ? `钱包余额: ${new BigNumber(stakeBalance?.toString() ?? '')
                    .div(TEN_POW(18))
                    .toString()} ${stakeTokenSymbol}`
                : `质押数量：${new BigNumber(stakeAmount?.toString() ?? '')
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
              确定
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
              确定
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
