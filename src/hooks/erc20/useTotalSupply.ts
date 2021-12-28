import { useContractCall } from '@usedapp/core'
import useERC20Contract from '../useContract'
import BigNumber from 'bignumber.js'

export default function useTotalSupply(address: string) {
  const contract = useERC20Contract(address)
  const result = useContractCall(contract && {
    address: contract.address,
    abi: contract.interface,
    method: 'totalSupply',
    args: [],
  })
  return result ? new BigNumber(result.toString()) : undefined
}
