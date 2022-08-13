import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Bignumber from 'bignumber.js'
import { Tag, Button, message } from 'antd'
import { useBlockMeta, useTokenBalance, useEthers } from '@usedapp/core'
import { usePool, usePoolFactory, usePoolInfo } from '../../../hooks/pool/usePool'
import { useStakeShow, useStakeOrClaim, useCreatePoolShow } from '../../../store'
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
  const { t } = useTranslation()
  const {
    onApprove,
    isAllowed,
    approveLoading,
    stakePoolLoading,
    stakeTokenSymbol,
    onClaimReward,
    claimLoading,
    stakeToken,
  } = usePool(pool)
  const [_, setStakeShow] = useStakeShow()
  const { setCurrentType, setCurAddress } = useStakeOrClaim()
  const { rewardTokenInfo, earnedAmount, rewardTokenSymbol, rewardToken } = usePoolInfo(pool)
  const { timestamp } = useBlockMeta()
  const { showCreate } = useCreatePoolShow()

  const stakeAmount = useTokenBalance(pool, account)
  const curBlockTimestamp = useMemo(() => (timestamp ? new Date(timestamp).getTime() : 0), [timestamp])

  const finishStatus = useMemo(() => {
    const startTime = new Bignumber(rewardTokenInfo.startTime ?? 0)
    const endTime = startTime.plus(new Bignumber(rewardTokenInfo.endTime))
    const currentTime = new Bignumber(curBlockTimestamp).div(1000)

    if (currentTime.lt(startTime)) {
      return 0
    } else if (currentTime.gt(startTime) && currentTime.lt(endTime)) {
      return 1
    } else if (currentTime.gt(endTime)) {
      return 2
    }
  }, [curBlockTimestamp, rewardTokenInfo])

  const rate = useMemo(
    () =>
      rewardTokenInfo?.rewardRate
        ? new Bignumber(rewardTokenInfo?.rewardRate?.toString()).div(TEN_POW(18)).times(3)
        : new Bignumber(0),
    [rewardTokenInfo?.rewardRate]
  )
  const allAmount = useMemo(
    () => new Bignumber(rate).times(rewardTokenInfo.endTime ?? 0).div(3),
    [rate, rewardTokenInfo]
  )

  const claimHandler = useCallback(async () => {
    if (new Bignumber(earnedAmount).gt(0) && !claimLoading) {
      try {
        await onClaimReward()
        message.success(t('pool_congratulation'))
      } catch (error) {
        message.error(t('pool_fail'))
      }
    }
  }, [claimLoading, earnedAmount, onClaimReward, t])

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
        {finishStatus === 0 ? t('pool_coming') : finishStatus === 1 ? t('pool_ongoing') : t('pool_closed')}
      </Tag>
      <div className="relative flex flex-col items-center">
        <img src="/static/pool_avatar.svg" alt="" />
        <img src="/static/autorenew.svg" className="absolute bottom-0 right-50% transform translate-x-full" alt="" />
      </div>
      <div className="flex flex-col items-center mt-8 font-bold text-lg">
        <span>
          {t('pool_pledge')} {stakeTokenSymbol}
        </span>
        <span>
          {t('pool_reward')} {rewardTokenSymbol}
        </span>
      </div>
      <div className="pt-8 pb-6 border-b border-solid">
        <div className="flex justify-between gap-2 text-sm">
          <span className="text-dark-gray">
            {t('pool_total_amount')}: {formatAmount(allAmount)} {rewardTokenSymbol}
          </span>
          <span
            className="text-primary underline underline-primary cursor-pointer"
            onClick={() =>
              finishStatus === 1 &&
              showCreate(3, {
                stakingToken: stakeToken,
                rewardToken,
                rewardRate: rate.div(3).toString(),
                startTime: '',
                poolId: pool,
              })
            }
          >
            {t('pool_append')}
          </span>
        </div>
        <div className="mt-2 text-dark-gray text-sm">
          {t('pool_rate')}: 1 block - {formatAmount(rate)}个
        </div>
      </div>
      <div className="py-6 flex justify-between text-sm">
        <span className="">
          {t('pool_my_reward')}: {formatAmount(earnedAmount)} {rewardTokenSymbol}
        </span>
        <span className="text-primary underline underline-primary cursor-pointer" onClick={claimHandler}>
          {t('pool_claim')}
        </span>
      </div>

      <div className="w-full flex gap-4">
        {finishStatus !== 2 ? (
          <>
            <Button
              type="primary"
              loading={stakePoolLoading || approveLoading}
              size="large"
              className="h-12 flex-1 rounded"
              disabled={finishStatus !== 1}
              onClick={handleApprove}
            >
              {isAllowed ? t('pool_pledge') : 'Approve'}
            </Button>
            {isAllowed && (
              <Button
                size="large"
                disabled={!stakeAmount?.gt(0)}
                className="h-12 flex-1 rounded"
                onClick={handleWithdraw}
              >
                {t('pool_unpledge')}
              </Button>
            )}
          </>
        ) : (
          <Button
            type="primary"
            danger
            size="large"
            className="h-12 flex-1 rounded"
            onClick={() => {
              showCreate(2, {
                stakingToken: stakeToken,
                rewardToken,
                rewardRate: rate.div(3).toString(),
                startTime: '',
                poolId: pool,
              })
            }}
          >
            {t('pool_restart')}
          </Button>
        )}
      </div>
    </div>
  )
}
