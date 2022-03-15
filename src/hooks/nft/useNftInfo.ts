import { useContractCalls, useEthers } from '@usedapp/core'
import { useNftContract } from '../useContract'
import BigNumber from 'bignumber.js'
import { Result } from '@ethersproject/abi'

export default function useNftInfo() {
  const { account } = useEthers()
  const nftContract = useNftContract()
  const nftMeta = { address: nftContract.address, abi: nftContract.interface }

  const [totalSupplyResult, balanceOfResult] = (useContractCalls([
    { ...nftMeta, method: 'totalSupply', args: [] },
    { ...nftMeta, method: 'balanceOf', args: [account] },
  ]) ?? []) as Result[]

  return {
    totalSupply: totalSupplyResult ? new BigNumber(totalSupplyResult[0].toString()) : undefined,
    myBalance: balanceOfResult ? new BigNumber(balanceOfResult[0].toString()) : undefined,
  }
}
