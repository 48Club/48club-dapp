import React, { useState, useMemo, useCallback } from 'react'
import { Button, Modal, ModalProps, Input } from 'antd'
import BigNumber from 'bignumber.js'
import { useTokenBalance, useEthers } from '@usedapp/core'
import { KogeAddress } from '../../../constants/contracts'
import { usePool } from '../../../hooks/pool/usePool'
import { formatAmount, TEN_POW } from '@funcblock/dapp-sdk'
import { useStakeOrClaim } from '../../../store'

export const StakeOrClaimModal = (props: Pick<ModalProps, 'visible' | 'onCancel'>) => {
  const { currentType } = useStakeOrClaim()
  const [amount, setAmount] = useState('')
  const amountBN = useMemo(() => new BigNumber(amount).times(TEN_POW(18)), [amount])
  const { account } = useEthers()
  const balance = useTokenBalance(KogeAddress, account)
  const { stakePoolLoading, onStakePool } = usePool()

  const handleStakePool = useCallback(async () => {
    if (!stakePoolLoading && amountBN.gt(0) && amountBN.lt(new BigNumber(balance?.toString() || ''))) {
      await onStakePool(amountBN)
    }
  }, [amountBN, balance, onStakePool, stakePoolLoading])

  return (
    <Modal {...props} footer={false} closeIcon={null} className="rounded-xl">
      <div className="p-6 rounded-xl">
        <div className="relative text-center text-[#1E1E1E] text-xl font-bold">
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
            <Input value="koge" size="large" className="h-12 border-none rounded bg-light-white" />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <span>奖励币种</span>
            <Input value="koge" size="large" className="h-12 border-none rounded bg-light-white" />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <span>解质押数量</span>
          <Input
            value={amount}
            type="number"
            size="large"
            className="h-12 border-none rounded bg-light-white"
            onChange={(e) => {
              setAmount(e.target.value)
            }}
          />
        </div>
        <div className="mt-8 w-full flex justify-center">
          <Button
            disabled={!amountBN.gt(0)}
            type="primary"
            size="large"
            className="w-50 h-12 rounded"
            onClick={handleStakePool}
          >
            确定
          </Button>
        </div>
      </div>
    </Modal>
  )
}