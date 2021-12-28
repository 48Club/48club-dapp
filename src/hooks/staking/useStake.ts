import { useCallback } from 'react'
import { useContractFunction, useEthers } from '@usedapp/core'
import BigNumber from 'bignumber.js'
import { useStakingContract } from '../useContract'


export default function useStake() {
  const { account } = useEthers()
  const stakingContract = useStakingContract()
  const { send, state } = useContractFunction(stakingContract, 'stake', { transactionName: 'Stake' })

  const mintYang = useCallback(async (amount: BigNumber) => {
    console.info('Staking | stake', amount.toString())
    await send(amount)
  }, [account, send])

  return {
    mintYang,
    loading: state.status === 'Mining',
  }
}
