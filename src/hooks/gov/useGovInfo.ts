import { useContractCalls, useEthers } from '@usedapp/core'
import { useGovernanceContract } from '../useContract'
import BigNumber from 'bignumber.js'
import { Result } from '@ethersproject/abi'

export default function useGovInfo() {
  const { account } = useEthers()
  const govContract = useGovernanceContract()

  const [minDepositResult] = (useContractCalls([
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'minDeposit',
      args: [],
    },
  ]) ?? []) as Result[]

  return {
    minDeposit: minDepositResult ? new BigNumber(minDepositResult.toString()) : undefined,
  }
}
