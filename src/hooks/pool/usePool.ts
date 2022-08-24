import { useCallback, useMemo } from 'react'
import {
  useContractFunction,
  useEthers,
  useTokenAllowance,
  useContractCall,
  useContractCalls,
  useToken,
  useTokenBalance,
} from '@usedapp/core'
import BigNumber from 'bignumber.js'
import { TEN_POW } from '@funcblock/dapp-sdk'
import { useFarmingContract, useFarmingFactoryContract } from '../useContract'
import useApprove from '../erc20/useApprove'

export const usePoolFactory = (rewardToken?: string) => {
  const { account } = useEthers()
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
      await deploy(stakingToken, rewardToken, rewardRate, Number(startTime), amount)
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
      console.info('FarmingFactory | contribute', startTime, amount)
      await contribute(poolId, amount, Number(startTime))
    },
    [contribute]
  )

  const poolAddresses = useContractCalls(
    Array(poolNum?.[0]?.toNumber() || 0).fill(1).map((item, index) => ({
      address: farmingFactoryContract.address,
      abi: farmingFactoryContract.interface,
      method: 'pools',
      args: [index],
    }))
  )

  const { approve: onApprove, loading: approveLoading } = useApprove(rewardToken, farmingFactoryContract.address)

  return {
    poolAddresses:poolAddresses?.map(item => item?.[0]) ?? [],
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
  const farmingContract = useFarmingContract(poolTokenAddress)

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

  const balanceOfResult = useContractCall({
    abi: farmingContract.interface,
    address: farmingContract.address,
    method: 'balanceOf',
    args: [account],
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
    myStakeAmount: balanceOfResult?.[0].toString() ?? '0',
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

export const stakingList = [
  {
    text: 'KOGE',
    token: '0x2B7BFE79eC36653b84A43E86AfF704B91E9f072f',
  },
  {
    text: 'WBNB',
    token: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  },
  {
    text: 'Pancake KOGE/BNB LP',
    token: '0xfcd08643A6390C465D8b12C42C0B4AFc291EAC12',
  },
  {
    text: 'Test LP',
    token: '0x929F65bc0fC681Dcc1420D030e374bAf5D14E40E'
  }
]
