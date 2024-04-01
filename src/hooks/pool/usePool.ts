import { useCallback, useMemo } from 'react'
import {
  useContractFunction,
  useEthers,
  useTokenAllowance,
  useContractCall,
  useContractCalls,
  useToken,
  useTokenBalance,
  useBlockMeta,
} from '@usedapp/core'
import BigNumber from 'bignumber.js'
import { TEN_POW } from '@funcblock/dapp-sdk'
import { useFarmingContract, useFarmingFactoryContract, useOracleContract } from '../useContract'
import Farming_ABI from '../abi/FarmingPool.json'
import useApprove from '../erc20/useApprove'
import { Interface } from '@ethersproject/abi'

export enum PoolSate {
  Coming,
  Ongoing,
  Finished,
}

const FARM_INTERFACE = new Interface(Farming_ABI)
export const usePoolFactory = (rewardToken?: string) => {
  const { account } = useEthers()
  const { timestamp } = useBlockMeta()

  const farmingFactoryContract = useFarmingFactoryContract() as any
  const poolNum = useContractCall({
    abi: farmingFactoryContract.interface,
    address: farmingFactoryContract.address,
    method: 'numPools',
    args: [],
  })

  const { send: deploy, state: deployState } = useContractFunction(farmingFactoryContract, 'deploy', {
    transactionName: 'deploy',
  })

  const onDeploy = useCallback(
    async ({
      stakingToken,
      rewardToken,
      rewardRate,
      startTime,
      amount,
    }: {
      stakingToken: string
      rewardToken: string
      rewardRate: string
      startTime: string
      amount: string
    }) => {
      console.info('FarmingFactory | deploy', stakingToken, rewardToken, rewardRate, startTime, amount)
      await deploy(stakingToken, rewardToken, rewardRate, startTime, amount)
    },
    [deploy]
  )

  const { send: contribute, state: contributeState } = useContractFunction(farmingFactoryContract, 'contribute', {
    transactionName: 'contribute',
  })
  const allowance = useTokenAllowance(rewardToken, account, farmingFactoryContract.address)
  const rewardBalance = useTokenBalance(rewardToken, account)

  const onContribute = useCallback(
    async ({ poolId, amount, startTime }: { poolId: number; startTime: string; amount: string }) => {
      console.info('FarmingFactory | contribute', poolId, amount, startTime)
      await contribute(poolId, amount, startTime)
    },
    [contribute]
  )

  const curBlockTimestamp = useMemo(() => (timestamp ? new Date(timestamp).getTime() : 0), [timestamp])

  const poolAddresses = useContractCalls(
    Array(poolNum?.[0]?.toNumber() || 0)
      .fill(1)
      .map((item, index) => ({
        address: farmingFactoryContract.address,
        abi: farmingFactoryContract.interface,
        method: 'pools',
        args: [index],
      }))
  )

  const poolAddress = poolAddresses?.map((item) => item?.[0]) ?? []

  const poolStartTimes = useContractCalls(
    poolAddress.length > 0
      ? poolAddress.map((address) => {
          return {
            address,
            abi: FARM_INTERFACE,
            method: 'startTime',
            args: [],
          }
        })
      : []
  )

  const poolEndTimes = useContractCalls(
    poolAddress.length > 0
      ? poolAddress.map((address) => {
          return {
            address,
            abi: FARM_INTERFACE,
            method: 'endTime',
            args: [],
          }
        })
      : []
  )

  const poolInfos = useMemo(() => {
    if (poolStartTimes.length <= 0 || poolEndTimes.length <= 0 || poolAddress.length <= 0) return []
    const allPool = poolAddress.reduce(
      (acc, address, index) => {
        const startTimes = poolStartTimes?.[index]?.[0]
        const endTimes = poolEndTimes?.[index]?.[0]

        if (!startTimes || !endTimes)
          return {
            coming: [],
            ongoing: [],
            finished: [],
          }
        const startTime = new BigNumber(startTimes.toString())
        const endTime = new BigNumber(endTimes.toString())
        const currentTime = new BigNumber(curBlockTimestamp).div(1000)
        const poolInfo = {
          address: address,
          startTime,
          endTime,
          status: PoolSate.Coming,
        }
        if (currentTime.lt(startTime)) {
          acc.coming.push(poolInfo)
        } else if (currentTime.gt(startTime) && currentTime.lt(endTime)) {
          poolInfo.status = PoolSate.Ongoing
          acc.ongoing.push(poolInfo)
        } else if (currentTime.gt(endTime)) {
          poolInfo.status = PoolSate.Finished
          acc.finished.push(poolInfo)
        }
        return acc
      },
      {
        coming: [],
        ongoing: [],
        finished: [],
      }
    )

    return allPool.coming.concat(allPool.ongoing, allPool.finished)
  }, [poolStartTimes, poolEndTimes, poolAddress, curBlockTimestamp])

  const { approve: onApprove, loading: approveLoading } = useApprove(rewardToken, farmingFactoryContract.address)

  return {
    poolAddresses: poolAddress,
    poolInfo: poolInfos,
    onDeploy,
    deployLoading: deployState.status === 'Mining',
    onContribute,
    contributeLoading: contributeState.status === 'Mining',
    onApprove,
    approveLoading,
    isAllowed: new BigNumber(allowance?.toString() ?? 0).gt(0),
    rewardBalance: new BigNumber(rewardBalance?.toString() ?? 0).div(TEN_POW(18)).toString(),
  }
}

export const usePool = (poolTokenAddress: string) => {
  const { account } = useEthers()
  const farmingContract = useFarmingContract(poolTokenAddress) as any

  const { send: stakePool, state: stakePoolState } = useContractFunction(farmingContract, 'stake', {
    transactionName: 'stakePool',
  })
  const { send: withdraw, state: withdrawState } = useContractFunction(farmingContract, 'withdraw', {
    transactionName: 'withdraw',
  })
  const { send: withdrawAll, state: withdrawAllState } = useContractFunction(farmingContract, 'withdrawAll', {
    transactionName: 'withdrawAll',
  })
  const { send: exit, state: exitState } = useContractFunction(farmingContract, 'exit', { transactionName: 'exit' })
  const { send: claimReward, state: claimState } = useContractFunction(farmingContract, 'claimReward', {
    transactionName: 'claimReward',
  })

  // const balanceOfResult = useContractCall({
  //   abi: farmingContract.interface,
  //   address: farmingContract.address,
  //   method: 'balanceOf',
  //   args: [account],
  // })
  const totalSupplyResult = useContractCall({
    abi: farmingContract.interface,
    address: farmingContract.address,
    method: 'totalSupply',
    args: [],
  })

  const stakeTokenAddress = useContractCall({
    abi: farmingContract.interface,
    address: farmingContract.address,
    method: 'stakingToken',
    args: [],
  })

  const data = useToken(stakeTokenAddress?.[0])

  const { approve: onApprove, loading: approveLoading } = useApprove(
    stakeTokenAddress?.[0].toString(),
    farmingContract.address
  )
  const allowance = useTokenAllowance(stakeTokenAddress?.[0].toString(), account, farmingContract.address)

  const onStakePool = useCallback(
    async (amount: BigNumber) => {
      console.info('Farming | StakePool', amount.toString())
      await stakePool(amount.toString())
    },
    [stakePool]
  )

  const onWithdraw = useCallback(
    async (amount: BigNumber) => {
      console.info('Farming | withdraw', amount.toString())
      await withdraw(amount.toString())
    },
    [withdraw]
  )

  const onWithdrawAll = useCallback(async () => {
    console.info('Farming | withdrawAll')
    await withdrawAll()
  }, [withdrawAll])

  const onExit = useCallback(async () => {
    console.info('Farming | exit')
    await exit()
  }, [exit])

  const onClaimReward = useCallback(async () => {
    console.info('Farming | claimReward')
    await claimReward()
  }, [claimReward])

  return {
    onStakePool,
    stakePoolLoading: stakePoolState.status === 'Mining',
    onWithdraw,
    withdrawLoading: withdrawState.status === 'Mining',
    onWithdrawAll,
    withdrawAllLoading: withdrawAllState.status === 'Mining',
    onExit,
    exitLoading: exitState.status === 'Mining',
    onClaimReward,
    claimLoading: claimState.status === 'Mining',
    // myStakeAmount: balanceOfResult?.[0].toString() ?? '0',
    totalStakeAmount: totalSupplyResult?.[0].toString() ?? '0',
    stakeToken: stakeTokenAddress?.[0].toString() ?? '',
    stakeTokenSymbol: data?.symbol ?? '',
    onApprove,
    approveLoading,
    isAllowed: new BigNumber(allowance?.toString() ?? 0).gt(0),
  }
}

export const usePoolInfo = (poolTokenAddress: string) => {
  const { account } = useEthers()
  const farmingContract = useFarmingContract(poolTokenAddress)
  const rewardToken = useContractCall({
    abi: farmingContract.interface,
    address: farmingContract.address,
    method: 'rewardToken',
    args: [],
  })
  const poolInfo = useContractCalls([
    { abi: farmingContract.interface, address: farmingContract.address, method: 'startTime', args: [] },
    { abi: farmingContract.interface, address: farmingContract.address, method: 'endTime', args: [] },
    { abi: farmingContract.interface, address: farmingContract.address, method: 'rewardRate', args: [] },
    { abi: farmingContract.interface, address: farmingContract.address, method: 'lastUpdateTime', args: [] },
    {
      abi: farmingContract.interface,
      address: farmingContract.address,
      method: 'earned',
      args: [account],
    },
  ])

  const results = useMemo(() => poolInfo?.map((res) => res?.[0]?.toString()), [poolInfo])

  const data = useToken(rewardToken?.[0])

  return {
    rewardToken: rewardToken?.[0]?.toString(),
    rewardTokenInfo: {
      poolTokenAddress,
      startTime: results[0],
      endTime: results[1],
      rewardRate: results[2],
      lastUpdateTime: results[3],
    },
    earnedAmount: results[4] ?? 0,
    rewardTokenSymbol: data?.symbol || '',
  }
}

export const useOracle = (...tokens: string[]) => {
  const oracleContract = useOracleContract()
  const results = useContractCalls(
    tokens.map((token) => ({
      abi: oracleContract.interface,
      address: oracleContract.address,
      method: 'kogePrice',
      args: [token],
    }))
  )

  const kogePrices = useMemo(() => results?.map((res) => res?.[0]?.toString()), [results])

  return {
    kogePrices,
  }
}
