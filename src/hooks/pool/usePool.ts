import { useCallback } from 'react'
import { useContractFunction, useEthers, useTokenAllowance, useContractCall } from '@usedapp/core'
import { useFarmingContract } from '../useContract'
import useApprove from '../erc20/useApprove'
import { KogeAddress } from '../../constants/contracts'
import BigNumber from 'bignumber.js'

export const usePool = () => {
  const { account } = useEthers()
  const farmingContract = useFarmingContract() as any
  const { approve: onApprove, loading: approveLoading } = useApprove(KogeAddress, farmingContract.address)
  const allowance = useTokenAllowance(KogeAddress, account, farmingContract.address)

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
    myBalance: balanceOfResult?.[0].toNumber() ?? 0,
    onApprove,
    approveLoading,
    isAllowed: new BigNumber(allowance?.toString() ?? 0).gt(0),
  }
}
