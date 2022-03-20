import { useContractCalls, useEthers } from '@usedapp/core'
import { useGovernanceContract, useNftContract } from '../useContract'
import { Result } from '@ethersproject/abi'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import ipfsToHttp from '../../utils/ipfsToHttp'

export interface INFTInfo {
  id: number
  uri: string
  owner: string
  isInUse: boolean
  image: string
  name: string
  description: string
}

export default function useNftInfo() {
  const { account } = useEthers()
  const nftContract = useNftContract()
  const govContract = useGovernanceContract()
  const nftMeta = useMemo(() => ({ address: nftContract.address, abi: nftContract.interface }), [nftContract])
  const govMeta = useMemo(() => ({ address: govContract.address, abi: govContract.interface }), [govContract])

  const [totalSupplyResult, balanceOfResult, nextMintCostResult] = (useContractCalls([
    { ...nftMeta, method: 'totalSupply', args: [] },
    { ...nftMeta, method: 'balanceOf', args: [account] },
    { ...nftMeta, method: 'getNextMintCost', args: [] },
  ]) ?? []) as Result[]

  const totalSupply = totalSupplyResult?.[0].toNumber() ?? 0
  const tokenIds = useMemo(() => new Array(totalSupply).fill(0).map((i, index) => index), [totalSupply])
  const tokensMeta = useMemo(() => tokenIds.map(id => ({ ...nftMeta, method: 'tokenURI', args: [id] })), [tokenIds, nftMeta])
  const tokensResults = useContractCalls(tokensMeta) as Result[]
  const ownersMeta = useMemo(() => tokenIds.map(id => ({ ...nftMeta, method: 'ownerOf', args: [id] })), [tokenIds, nftMeta])
  const ownersResults = useContractCalls(ownersMeta) as Result[]
  const isInUseMeta = useMemo(() => tokenIds.map(id => ({ ...govMeta, method: 'isNftInUse', args: [id] })), [tokenIds, govMeta])
  const isInUseResults = useContractCalls(isInUseMeta) as Result[]

  const owners = useMemo(() => ownersResults.map(i => i?.[0].toString()), [ownersResults])
  const isInUses = useMemo(() => isInUseResults.map(i => i?.[0]), [isInUseResults])
  const tokenURIs = useMemo(() => tokensResults.map(i => i?.[0].toString()), [tokensResults])
  const [jsons, setJsons] = useState<any[]>([])

  useEffect(() => {
    // TODO: 429 too many requests. Need a queue/trunk to optimize
    if (!tokenURIs || tokenURIs.join('_') === jsons.map(i => i.uri).join('_')) {
      return
    }
    (async () => {
      try {
        setJsons(tokenURIs.map((i, index) => ({ uri: tokenURIs[index] })))
        const urls = tokenURIs.map(i => ipfsToHttp(i))
        const res = await Promise.all(urls.map(i => i ? fetch(i).catch(console.error) : undefined))
        const jsons = await Promise.all(res.map(i => i ? i.json().catch(console.error) : {}))
        setJsons(jsons.map((i, index) => ({ ...i, uri: tokenURIs[index] })))
      } catch (e) {
        console.error(e)
      }
    })()
  }, [tokenURIs, jsons])


  const NFTs: INFTInfo[] = useMemo(() => ((tokenURIs ?? []).map((i, index) => {
    return {
      id: index,
      uri: tokenURIs[index],
      owner: owners[index],
      isInUse: isInUses[index],
      image: ipfsToHttp(jsons[index]?.image) ?? '',
      name: jsons[index]?.name ?? '...',
      description: jsons[index]?.description ?? '...',
    }
  })), [tokenURIs, owners, jsons, isInUses])

  return {
    totalSupply,
    myBalance: balanceOfResult?.[0].toNumber() ?? 0,
    nextMintCost: new BigNumber(nextMintCostResult?.[0].toString() ?? 0),
    NFTs,
    myNFTs: NFTs.filter(i => i.owner === account),
  }
}
