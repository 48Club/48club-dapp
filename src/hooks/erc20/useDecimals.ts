import { useContractCall } from '@usedapp/core'
import useERC20Contract from '../useContract'

export default function useDecimals(address: string) {
  const contract = useERC20Contract(address)
  const [result] = useContractCall(contract && {
    address: contract.address,
    abi: contract.interface,
    method: 'decimals',
    args: [],
  }) ?? []
  return result
}
