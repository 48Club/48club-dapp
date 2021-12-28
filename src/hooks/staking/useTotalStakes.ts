import { useContractCall } from '@usedapp/core'
import { useStakingContract } from '../useContract'
import BigNumber from 'bignumber.js'

export default function useTotalStakes() {
  const stakingContract = useStakingContract()
  const result = useContractCall({
    address: stakingContract.address,
    abi: stakingContract.interface,
    method: 'totalStakes',
    args: [],
  })
  return result ? new BigNumber(result.toString()) : undefined
}
