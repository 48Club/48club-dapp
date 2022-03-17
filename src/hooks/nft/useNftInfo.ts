import { useContractCalls, useEthers } from '@usedapp/core'
import { useNftContract } from '../useContract'
import { Result } from '@ethersproject/abi'
import BigNumber from 'bignumber.js'

export default function useNftInfo() {
  const { account } = useEthers()
  const nftContract = useNftContract()
  const nftMeta = { address: nftContract.address, abi: nftContract.interface }

  const [totalSupplyResult, balanceOfResult, nextMintCostResult] = (useContractCalls([
    { ...nftMeta, method: 'totalSupply', args: [] },
    { ...nftMeta, method: 'balanceOf', args: [account] },
    { ...nftMeta, method: 'getNextMintCost', args: [] },
  ]) ?? []) as Result[]

  const totalSupply = totalSupplyResult?.[0].toNumber() ?? 0
  const tokensMeta = new Array(totalSupply).fill(0).map((i, index) => ({ ...nftMeta, method: 'tokenURI', args: [index] }))
  const tokensResults = (useContractCalls(tokensMeta) ?? []) as Result[]
  const ownersMeta = new Array(totalSupply).fill(0).map((i, index) => ({ ...nftMeta, method: 'ownerOf', args: [index] }))
  const ownersResults = (useContractCalls(ownersMeta) ?? []) as Result[]

  const owners = ownersResults.map(i => i?.[0].toString())

  return {
    totalSupply,
    myBalance: balanceOfResult?.[0].toNumber() ?? 0,
    nextMintCost: new BigNumber(nextMintCostResult?.[0].toString() ?? 0),
    tokenURIs: tokensResults.map(i => i?.[0].toString()),
    owners,
    myNFTs: tokensResults.map((i, index) => ({ id: index, uri: i?.[0].toString() })).filter((i, index) => owners?.[index] === account),
  }
}
