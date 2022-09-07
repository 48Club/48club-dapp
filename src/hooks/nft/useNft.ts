import { useCallback } from 'react'
import { useContractFunction, useEthers, useTokenAllowance } from '@usedapp/core'
import { useNftContract } from '../useContract'
import useApprove from '../erc20/useApprove'
import { KogeAddress } from '../../constants/contracts'
import BigNumber from 'bignumber.js'

export default function useNft() {
  const { account } = useEthers()
  const nftContract = useNftContract() as any
  const { send: setTokenURI, state: setTokenURIState } = useContractFunction(nftContract, 'setTokenURI', {
    transactionName: 'SetTokenURI',
  })
  const { send: mint, state: mintState } = useContractFunction(nftContract, 'safeMint', { transactionName: 'Mint' })
  const { send: transfer, state: transferState } = useContractFunction(nftContract, 'safeTransferFrom', {
    transactionName: 'SafeTransferFrom',
  })
  const { approve: onApprove, loading: approveLoading } = useApprove(KogeAddress, nftContract.address)
  const allowance = useTokenAllowance(KogeAddress, account, nftContract.address)

  const onMint = useCallback(
    async (tokenURI: string) => {
      console.info('NFT | mint', tokenURI)
      await mint(account, tokenURI)
    },
    [account, mint]
  )

  const onSetTokenURI = useCallback(
    async (tokenId: string, tokenURI: string) => {
      console.info('NFT | setTokenURI', tokenId, '->', tokenURI)
      await setTokenURI(tokenId, tokenURI)
    },
    [setTokenURI]
  )

  const onTransfer = useCallback(
    async (address: string, tokenId: string) => {
      console.log('NFT | transfer', tokenId)
      await transfer(account, address, tokenId)
    },
    [account, transfer]
  )

  return {
    onMint,
    mintLoading: mintState.status === 'Mining',
    onApprove,
    approveLoading,
    isAllowed: new BigNumber(allowance?.toString() ?? 0).gt(0),
    onSetTokenURI,
    setBaseURILoading: setTokenURIState.status === 'Mining',
    onTransfer,
    transferLoading: transferState.status === 'Mining',
  }
}
