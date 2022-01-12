import { useCallback } from 'react'
import { useContractFunction, useEthers } from '@usedapp/core'
import BigNumber from 'bignumber.js'
import { useStakingContract } from '../useContract'


export default function useStake() {
  const { account } = useEthers()
  const stakingContract = useStakingContract()
  const { send: stake, state: stakeState } = useContractFunction(stakingContract, 'stake', { transactionName: 'Stake' })
  const { send: unstake, state: unstakeState } = useContractFunction(stakingContract, 'unstake', { transactionName: 'Unstake' })
  const { send: withdraw, state: withdrawState } = useContractFunction(stakingContract, 'withdraw', { transactionName: 'Unstake' })

  const onStake = useCallback(async (amount: BigNumber) => {
    console.info('Staking | stake', amount.toString())
    await stake(amount.toString())
  }, [account, stake])

  const onUnstake = useCallback(async (amount: BigNumber) => {
    console.info('Staking | unstake', amount.toString())
    await unstake(amount.toString())
  }, [account, unstake])

  const onWithdraw = useCallback(async (amount: BigNumber) => {
    console.info('Staking | withdraw', amount.toString())
    await withdraw(amount.toString())
  }, [account, unstake])

  return {
    onStake,
    stakeLoading: stakeState.status === 'Mining',
    onUnstake,
    unstakeLoading: unstakeState.status === 'Mining',
    onWithdraw,
    withdrawLoading: withdrawState.status === 'Mining',
  }
}
