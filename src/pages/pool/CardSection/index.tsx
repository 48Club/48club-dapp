import React, { useCallback, useMemo } from 'react'
import Bignumber from 'bignumber.js'
import { Tag, Button, message } from 'antd'
import { useBlockMeta, useTokenBalance, useEthers } from '@usedapp/core'
import { usePool, usePoolFactory, usePoolInfo } from '../../../hooks/pool/usePool'
import { useStakeShow, useStakeOrClaim } from '../../../store'
import { TEN_POW, formatAmount } from '@funcblock/dapp-sdk'

export const PoolCardSection = () => {
  const { poolAddresses } = usePoolFactory()

  return (
    <div className="flex flex-wrap gap-6 mb-30 <sm:justify-center">
      {poolAddresses.map((pool) => (
        <PoolCard pool={pool} key={pool} />
      ))}
    </div>
  )
}

function PoolCard({ pool }: { pool: string }) {
  const { account } = useEthers()
  const { onApprove, isAllowed, approveLoading, stakePoolLoading, stakeTokenSymbol, onClaimRewards, claimLoading } =
    usePool(pool)
  const [_, setStakeShow] = useStakeShow()
  const { setCurrentType, setCurAddress } = useStakeOrClaim()
  const { rewardTokenInfo, earnedAmount, rewardTokenSymbol } = usePoolInfo(pool)
  const { timestamp } = useBlockMeta()

  const stakeAmount = useTokenBalance(pool, account)
  const curBlockTimestamp = useMemo(() => (timestamp ? new Date(timestamp).getTime() : 0), [timestamp])
  const finishStatus = useMemo(() => {
    const num = new Bignumber(rewardTokenInfo?.periodFinish?.toString() ?? '')
    const currentTime = new Bignumber(curBlockTimestamp).div(1000)
    if (num.eq(0)) {
      return 0
    } else if (num.gt(currentTime)) {
      return 1
    } else if (num.lt(currentTime)) {
      return 2
    }
  }, [curBlockTimestamp, rewardTokenInfo])
  const rate = useMemo(
    () =>
      rewardTokenInfo?.rewardRate
        ? new Bignumber(rewardTokenInfo?.rewardRate?.toString()).div(TEN_POW(18)).times(3)
        : 0,
    [rewardTokenInfo?.rewardRate]
  )
  const remaining = useMemo(() => {
    if (rewardTokenInfo.periodFinish && curBlockTimestamp) {
      return new Bignumber(curBlockTimestamp)
        .div(1000)
        .minus(rewardTokenInfo.periodFinish.toString())
        .times(rate)
        .times(-1)
        .toString()
    } else {
      return 0
    }
  }, [rewardTokenInfo, curBlockTimestamp, rate])

  const claimHandler = useCallback(async () => {
    if (new Bignumber(earnedAmount).gt(0) && !claimLoading) {
      await onClaimRewards()
    }
  }, [claimLoading, earnedAmount, onClaimRewards])

  const handleApprove = useCallback(() => {
    if (!isAllowed) {
      onApprove()
    } else {
      setStakeShow(true)
      setCurrentType(1)
      setCurAddress(pool)
    }
  }, [isAllowed, onApprove, pool, setCurAddress, setCurrentType, setStakeShow])

  const handleWithdraw = useCallback(() => {
    setStakeShow(true)
    setCurrentType(2)
    setCurAddress(pool)
  }, [pool, setCurAddress, setCurrentType, setStakeShow])

  return (
    <div className="relative w-90 flex-col py-10 px-8 shadow rounded-xl bg-white">
      <Tag color="#EF2B2B" className="absolute top-0 left-8 transform -translate-y-1/2 rounded border-none text-sm">
        {finishStatus === 0 ? '即将开始' : finishStatus === 1 ? '进行中' : '已关闭'}
      </Tag>
      <div className="relative flex flex-col items-center">
        <img src="/static/pool_avatar.svg" alt="" />
        <img src="/static/autorenew.svg" className="absolute bottom-0 right-50% transform translate-x-full" alt="" />
      </div>
      <div className="flex flex-col items-center mt-8 font-bold text-lg">
        <span>质押 {stakeTokenSymbol}</span>
        <span>奖励 {rewardTokenSymbol}</span>
      </div>
      <div className="pt-8 pb-6 border-b border-solid">
        <div className="flex justify-between gap-2 text-sm">
          <span className="text-dark-gray">
            发行总量：{formatAmount(remaining)} {rewardTokenSymbol}
          </span>
          <span className="text-primary underline underline-primary">追加资金</span>
        </div>
        <div className="mt-2 text-dark-gray text-sm">释放速率：1block - {formatAmount(rate)}个</div>
      </div>
      <div className="py-6 flex justify-between text-sm">
        <span className="">
          我的奖励：{formatAmount(earnedAmount)} {rewardTokenSymbol}
        </span>
        <span className="text-primary underline underline-primary cursor-pointer" onClick={claimHandler}>
          领取奖励
        </span>
      </div>

      <div className="w-full flex gap-4">
        {finishStatus !== 2 && (
          <>
            <Button
              type="primary"
              loading={stakePoolLoading || approveLoading}
              size="large"
              className="h-12 flex-1 rounded"
              onClick={handleApprove}
            >
              {isAllowed ? '质押' : '授权'}
            </Button>
            {isAllowed && (
              <Button
                size="large"
                disabled={!stakeAmount?.gt(0)}
                className="h-12 flex-1 rounded"
                onClick={handleWithdraw}
              >
                解质押
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
