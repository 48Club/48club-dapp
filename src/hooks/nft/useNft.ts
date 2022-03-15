import { useCallback } from 'react'
import { useContractFunction, useEthers, useTokenAllowance } from '@usedapp/core'
import { useNftContract } from '../useContract'
import useApprove from '../erc20/useApprove'
import { KogeAddress } from '../../constants/contracts'
import BigNumber from 'bignumber.js'


export default function useNft() {
  const { account } = useEthers()
  const nftContract = useNftContract()
  const { send: mint, state: mintState } = useContractFunction(nftContract, 'safeMint', { transactionName: 'Mint' })
  const { approve: onApprove, loading: approveLoading } = useApprove(KogeAddress, nftContract.address)
  const allowance = useTokenAllowance(KogeAddress, account, nftContract.address)

  const onMint = useCallback(async (tokenURI: string) => {
    console.info('NFT | mint', tokenURI)
    await mint(account, tokenURI)
  }, [account, mint])

  return {
    onMint,
    mintLoading: mintState.status === 'Mining',
    onApprove,
    approveLoading,
    isAllowed: new BigNumber(allowance?.toString() ?? 0).gt(0),
  }
}
