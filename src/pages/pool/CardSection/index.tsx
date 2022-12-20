import React, { useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Bignumber from 'bignumber.js'
import { Tag, Button, message, Tooltip } from 'antd'
import moment from 'moment'
import { TEN_POW, formatAmount } from '@funcblock/dapp-sdk'
import { useBlockMeta, useTokenBalance, useEthers, getExplorerAddressLink, BSC } from '@usedapp/core'
import { TOKENS } from '../../../constants/tokens'
import { usePool, usePoolFactory, usePoolInfo, useOracle } from '../../../hooks/pool/usePool'
import {
  useStakeShow,
  useStakeOrClaim,
  useCreatePoolShow,
  useRewardTokenSymbolList,
  usePoolFilter,
} from '../../../store'

export const PoolCardSection = () => {
  const { poolAddresses } = usePoolFactory()

  return (
    <div className="flex md:flex-wrap md:flex-row md:items-start flex-col items-stretch gap-6 pt-0 mb-30">
      {poolAddresses.map((pool, index) => (pool ? <PoolCard pool={pool} key={pool} id={index} /> : null))}
    </div>
  )
}

function PoolCard({ pool, id }: { pool: string; id: number }) {
  const { t } = useTranslation()

  const { account, chainId = BSC.chainId } = useEthers()
  const {
    onApprove,
    isAllowed,
    approveLoading,
    stakePoolLoading,
    stakeTokenSymbol,
    onClaimReward,
    claimLoading,
    stakeToken,
    totalStakeAmount,
    onExit,
    exitLoading,
  } = usePool(pool)
  const [_, setStakeShow] = useStakeShow()
  const { setCurrentType, setCurAddress } = useStakeOrClaim()
  const { list, setList } = useRewardTokenSymbolList()
  const { rewardTokenInfo, earnedAmount, rewardTokenSymbol, rewardToken } = usePoolInfo(pool)
  const { timestamp } = useBlockMeta()
  const { showCreate } = useCreatePoolShow()
  const { filterDetail } = usePoolFilter()

  useEffect(() => {
    if (rewardToken && rewardTokenSymbol) {
      setList((list) => ({ ...list, [rewardToken.toString()]: rewardTokenSymbol }))
    }

    if (stakeToken && stakeTokenSymbol) {
      setList((list) => ({ ...list, [stakeToken.toString()]: stakeTokenSymbol }))
    }
  }, [rewardTokenSymbol, rewardToken, stakeToken, stakeTokenSymbol, setList])

  const stakeAmount = useTokenBalance(pool, account)
  const curBlockTimestamp = useMemo(() => (timestamp ? new Date(timestamp).getTime() : 0), [timestamp])

  const finishStatus = useMemo(() => {
    const startTime = new Bignumber(rewardTokenInfo.startTime ?? 0)
    const endTime = new Bignumber(rewardTokenInfo.endTime)
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
  const allAmount = useMemo(() => {
    const startTime = new Bignumber(rewardTokenInfo.startTime ?? 0)
    const endTime = new Bignumber(rewardTokenInfo.endTime)
    const rate = new Bignumber(rewardTokenInfo?.rewardRate?.toString() ?? 0)

    if (startTime && endTime && rate) {
      return endTime.minus(startTime).times(rate)
    } else {
      return
    }
  }, [rewardTokenInfo])

  // rewardRate*3600*24*365*rewardTokenPrice/pool.totalSupply/stakingTokenPrice/1e18
  const { kogePrices } = useOracle(stakeToken, rewardToken)
  const apr = useMemo(() => {
    return new Bignumber(rewardTokenInfo?.rewardRate?.toString() ?? 0)
      .times(3600)
      .times(24)
      .times(365)
      .times(new Bignumber(kogePrices?.[1] ?? 0))
      .div(totalStakeAmount ?? 0)
      .div(new Bignumber(kogePrices?.[0] ?? 0))
      .times(100)
  }, [rewardTokenInfo, kogePrices, totalStakeAmount])
  console.log(
    `apr: ${apr} \n`,
    `rate: ${rewardTokenInfo?.rewardRate?.toString()} \n`,
    `rewardTokenPrice: ${kogePrices?.[1]} \n`,
    `stakeTokenPrice: ${kogePrices?.[0]} \n`,
    `totalSupply: ${totalStakeAmount}`
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

  const exitHandler = useCallback(async () => {
    await onExit()
  }, [onExit])

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
    <div
      className={`relative w-90 flex-col py-10 px-8 shadow rounded-xl bg-white ${
        (filterDetail.status === -1 || filterDetail.status === finishStatus) &&
        (filterDetail.stakeAddress === stakeToken || filterDetail.stakeAddress === '')
          ? ''
          : 'hidden'
      }`}
    >
      <Tag
        color={finishStatus === 0 ? '#EF2B2B' : finishStatus === 1 ? '#08C849' : '#B9817D'}
        className="absolute top-0 left-8 transform -translate-y-1/2 rounded border-none text-sm"
      >
        {finishStatus === 0 ? t('pool_coming') : finishStatus === 1 ? t('pool_ongoing') : t('pool_closed')}
      </Tag>
      <div className="relative flex flex-col items-center">
        <img src="/static/logo-koge.png" alt="" className="w-24 h-24" />
        {/* <img src="/static/autorenew.svg" className="absolute bottom-0 right-50% transform translate-x-full" alt="" /> */}
      </div>
      <div className="flex flex-col items-center mt-8 font-bold text-lg">
        <span>
          {t('pool_pledge')} {TOKENS[stakeToken] ?? stakeTokenSymbol}
        </span>
        <span className="cursor-pointer">
          {t('pool_reward')}{' '}
          <Tooltip
            title={
              <a
                className="cursor-pointer"
                href={getExplorerAddressLink(rewardToken, chainId)}
                target="_blank"
                rel="noreferrer"
              >
                {rewardToken}
              </a>
            }
          >
            {TOKENS[rewardToken] ?? rewardTokenSymbol}
          </Tooltip>
        </span>
      </div>
      <div className="pt-8 pb-6 border-b border-solid">
        <div className="mt-2 flex justify-between items-center text-dark-gray text-sm">
          <span className="font-bold text-base">{t('APR')}:</span>
          <span className="font-bold text-base">{formatAmount(apr, undefined, 8)}%</span>
        </div>
        <div className="mt-2 flex justify-between items-center gap-2 text-sm">
          <span className="text-dark-gray">
            {t('pool_total_amount')}: {formatAmount(allAmount, 18)} {TOKENS[rewardToken] ?? rewardTokenSymbol}
          </span>
          <span
            className="text-primary underline underline-primary cursor-pointer"
            onClick={() =>
              showCreate(3, {
                stakingToken: stakeToken,
                rewardToken,
                rewardRate: rate.div(3).toString(),
                startTime: '',
                poolId: id,
                status: finishStatus,
              })
            }
          >
            {t('pool_append')}
          </span>
        </div>
        <div className="mt-2 text-dark-gray text-sm">
          {t('pool_rate')}: 1 block - {formatAmount(rate, 0, 8)}
        </div>

        <div className="mt-2 flex justify-between items-center text-dark-gray text-sm">
          <span>{t('pool_total_stake')}:</span>
          <span>
            {formatAmount(totalStakeAmount, 18)} {TOKENS[stakeToken] ?? stakeTokenSymbol}
          </span>
        </div>
        <div className="mt-2 flex justify-between items-center text-dark-gray text-sm">
          <span>{t('pool_my_stake')}:</span>
          <span>
            {formatAmount(stakeAmount, 18)} {TOKENS[stakeToken] ?? stakeTokenSymbol}
          </span>
        </div>
        {rewardTokenInfo.startTime && (
          <div className="mt-2 flex justify-between items-center text-dark-gray text-sm">
            <span>{t('pool_start_time')}:</span>
            <span>{moment.unix(rewardTokenInfo.startTime).format('YYYY/MM/DD HH:mm:ss')}</span>
          </div>
        )}
        {rewardTokenInfo.endTime && (
          <div className="mt-2 flex justify-between items-center text-dark-gray text-sm">
            <span>{t('pool_end_time')}:</span>
            <span>{moment.unix(rewardTokenInfo.endTime).format('YYYY/MM/DD HH:mm:ss')}</span>
          </div>
        )}
      </div>
      <div className="py-6 flex justify-between items-center text-sm">
        <span className="">
          {t('pool_my_reward')}: {formatAmount(earnedAmount, 18)} {TOKENS[rewardToken] ?? rewardTokenSymbol}
        </span>
        <div className="flex items-center gap-1">
          <Button type="primary" size="small" loading={claimLoading} onClick={claimHandler}>
            {t('pool_claim')}
          </Button>
          <Button type="primary" size="small" loading={exitLoading} onClick={exitHandler}>
            {t('pool_exit')}
          </Button>
        </div>
      </div>

      <div className="w-full flex gap-4">
        {finishStatus !== 2 ? (
          <>
            <Button
              type="primary"
              loading={stakePoolLoading || approveLoading}
              size="large"
              className="h-12 flex-1 rounded"
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
            disabled={!account}
            onClick={() => {
              showCreate(2, {
                stakingToken: stakeToken,
                rewardToken,
                rewardRate: rate.div(3).toString(),
                startTime: '',
                poolId: id,
                status: finishStatus,
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
