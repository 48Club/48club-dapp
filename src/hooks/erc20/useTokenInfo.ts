import { useContractCalls } from '@usedapp/core'
import useERC20Contract from '../useContract'
import BigNumber from 'bignumber.js'

export default function useTokenInfo(address: string) {
  const contract = useERC20Contract(address)
  const [totalSupplyResult, decimalsResult] = useContractCalls(contract ? [
    {
      address: contract.address,
      abi: contract.interface,
      method: 'totalSupply',
      args: [],
    },
    {
      address: contract.address,
      abi: contract.interface,
      method: 'decimals',
      args: [],
    },
  ] : [])
  return {
    totalSupply: totalSupplyResult ? new BigNumber(totalSupplyResult.toString()) : undefined,
    decimals: decimalsResult ? new BigNumber(decimalsResult.toString()).toNumber() : undefined,
  }
}
