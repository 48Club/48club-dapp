import { useCallback } from 'react'
import { useContractFunction, useEthers, useTokenAllowance, useContractCall, useContractCalls } from '@usedapp/core'
import { useFarmingContract, useFarmingFactoryContract } from '../useContract'
import useApprove from '../erc20/useApprove'
import { TStakingAddress } from '../../constants/contracts'
import BigNumber from 'bignumber.js'

export const usePoolFactory = () => {
  const farmingFactoryContract = useFarmingFactoryContract()
  const poolNum = useContractCall({
    abi: farmingFactoryContract.interface,
    address: farmingFactoryContract.address,
    method: 'numPools',
    args: [],
  })
  const poolAddresses = useContractCalls(
    Array(poolNum?.[0] || 0).map((item, index) => ({
      address: farmingFactoryContract.address,
      abi: farmingFactoryContract.interface,
      method: 'pools',
      args: [index],
    }))
  )

  return {
    poolAddresses: poolAddresses?.[0] ?? [],
  }
}

export const usePool = (tokenAddress: string) => {
  const { account } = useEthers()
  const farmingContract = useFarmingContract(tokenAddress) as any

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
  const { send: claimRewards, state: claimState } = useContractFunction(farmingContract, 'claimRewards', {
    transactionName: 'claimRewards',
  })

  const balanceOfResult = useContractCall({
    abi: farmingContract.interface,
    address: farmingContract.address,
    method: 'balanceOf',
    args: [account],
  })

  const binType = useContractCall({
    abi: farmingContract.interface,
    address: farmingContract.address,
    method: 'stakingToken',
    args: [],
  })

  const { approve: onApprove, loading: approveLoading } = useApprove(binType?.[0].toString(), farmingContract.address)
  const allowance = useTokenAllowance(binType?.[0].toString(), account, farmingContract.address)

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

  const onClaimRewards = useCallback(async () => {
    console.info('Farming | claimRewards')
    await claimRewards()
  }, [claimRewards])

  return {
    onStakePool,
    stakePoolLoading: stakePoolState.status === 'Mining',
    onWithdraw,
    withdrawLoading: withdrawState.status === 'Mining',
    onWithdrawAll,
    withdrawAllLoading: withdrawAllState.status === 'Mining',
    onExit,
    exitLoading: exitState.status === 'Mining',
    onClaimRewards,
    claimLoading: claimState.status === 'Mining',
    myBalance: balanceOfResult?.[0].toString() ?? '0',
    binType: binType?.[0].toString() ?? '',
    onApprove,
    approveLoading,
    isAllowed: new BigNumber(allowance?.toString() ?? 0).gt(0),
  }
}

export const usePoolInfo = (tokenAddress: string) => {
  const { account } = useEthers()
  const farmingContract = useFarmingContract(tokenAddress)
  const rewardToken = useContractCall({
    abi: farmingContract.interface,
    address: farmingContract.address,
    method: 'rewardTokensArray',
    args: [0],
  })

  const rewardTokenInfo = useContractCall({
    abi: farmingContract.interface,
    address: farmingContract.address,
    method: 'rewardTokenInfo',
    args: [rewardToken?.[0]],
  })

  const earnedAmount = useContractCall({
    abi: farmingContract.interface,
    address: farmingContract.address,
    method: 'earned',
    args: [rewardToken?.[0], account],
  })

  return {
    rewardTokenInfo: rewardTokenInfo?.[0] ?? {},
    earnedAmount: earnedAmount?.[0] ?? 0
  }
}
