import useERC20Contract, { useStakeInscriptionContract, useWrappedContract } from '@/hooks/useContract'
import {
  useBlockNumber,
  useCall,
  useCalls,
  useContractCall,
  useContractCalls,
  useContractFunction,
  useEthers,
  useSendTransaction,
  useTokenBalance,
} from '@usedapp/core'
import { Result } from '@ethersproject/abi'
import { KogeAddress, wrappedToken } from '@/constants/contracts'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
import inscriptionsApi from '@/utils/request'
import { decimalsToStr, strToDecimals } from '@/utils'

import modal from 'antd/es/modal'
import * as utils from 'web3-utils'
export const useWrapTokenInfo = () => {
  const warpContact = useWrappedContract()
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(wrappedToken, account)
  const [balance, decimals] = (useContractCalls([
    {
      address: warpContact.address,
      abi: warpContact.interface,
      method: 'balanceOf',
      args: [account],
    },
    {
      address: warpContact.address,
      abi: warpContact.interface,
      method: 'decimals',
      args: [],
    },
  ]) ?? []) as Result
  return {
    kogeBalance: tokenBalance ? tokenBalance.toString() : undefined,
    kogedecimals: 8,
    ikogeBalance: balance ? balance.toString() : undefined,
    ikogedecimals: decimals ? decimals.toString() : undefined,
  }
}

export const useWrapAcitons = () => {
  const warpContact = useWrappedContract()
  const { send: Warp, state: WarpState } = useContractFunction(warpContact, 'warp', {
    transactionName: 'Warp',
  })

  const { send: UnWarp, state: UnWarpState } = useContractFunction(warpContact, 'unwarp', {
    transactionName: 'UnWarp',
  })

  const { send: Multisend, state: multisendState } = useContractFunction(warpContact, 'multisend', {
    transactionName: 'Multisend',
  })

  const { send: BfansToFans, state: BfansToFansState } = useContractFunction(warpContact, 'bfansToFans', {
    transactionName: 'bfansToFans',
  })

  const onWarp = useCallback(
    async (tickhash: string, amount: BigNumber) => {
      console.info('Staking | stake', amount.toString())
      await Warp(tickhash, amount.toString())
    },
    [Warp]
  )

  const onMultisend = useCallback(
    async (address: string[], value: string[]) => {
      if (address.length != value.length) return
      return await Multisend(address, value)
    },
    [Multisend]
  )
  const unWarp = useCallback(
    async (tickhash: string, amount: BigNumber) => {
      console.info('Staking | stake', amount.toString())
      await UnWarp(tickhash, amount.toString())
    },
    [Warp]
  )
  const onbfanstofans = useCallback(
    (haxh: string) => {
      return BfansToFans(haxh)
    },
    [BfansToFans]
  )

  return {
    onWarp,
    unWarp,
    onMultisend,
    onbfanstofans,
    warpLoading: WarpState.status === 'Mining' || WarpState.status === 'PendingSignature',
    unWarpLoading: UnWarpState.status === 'Mining' || UnWarpState.status === 'PendingSignature',
    multisendLoading: multisendState.status === 'Mining' || multisendState.status === 'PendingSignature',
    BfansToFansLoading: BfansToFansState.status === 'Mining' || BfansToFansState.status === 'PendingSignature',
  }
}

export const useInscriptionbalance = () => {
  const { account } = useEthers()

  const [result, setResult] = useState<
    | undefined
    | {
        amount: number
        tick: string
        tick_hash: string
        balance: number
        protocol: string
        decimals: number
      }[]
  >()
  const [loading, setLoading] = useState(false)

  const getBalance = () => {
    setLoading(true)
    inscriptionsApi
      .getUserBalances({ address: (account || 'undefined') as string })
      .then((res) => {
        if (res.code === 0) {
          const walletList = res.data.wallet.map((item) => {
            return {
              ...item,
              amount: decimalsToStr(item.balance, item?.decimals),
            }
          })
          setResult(walletList)
        }
      })
      .then(() => setLoading(false))
  }

  const updata = () => {
    getBalance()
  }

  useEffect(() => {
    getBalance()
  }, [account])

  return {
    result,
    loading,
    updata,
  }
}

export const useStakeInscriptionAcitons = () => {
  const { account, chainId } = useEthers()
  const stakeContract = useStakeInscriptionContract()

  const { send: redeem, state: redeemState } = useContractFunction(stakeContract, 'redeem', {
    transactionName: 'redeem',
  })
  const { send: cancelRedeem, state: cancelRedeemState } = useContractFunction(stakeContract, 'cancelRedeem', {
    transactionName: 'cancelRedeem',
  })

  const { send: finalizeRedeem, state: finalizeRedeemState } = useContractFunction(stakeContract, 'finalizeRedeem', {
    transactionName: 'finalizeRedeem',
  })

  const { sendTransaction, state } = useSendTransaction()

  const transfer = async (tick_hash: string, amount: string) => {
    if (account === undefined) {
      modal.info({
        title: '',
        content: 'Please Connect the Wallet First',
        wrapClassName: 'alert-model-wrap',
        centered: true,
      })
      return
    }

    const str = `data:,
        {
          "p":"bnb-48",
          "op":"transfer",
          "tick-hash":"${tick_hash}",
          "to":"${stakeContract.address}",
          "amt":"${amount}"
        }`

    console.log('[str]:', str, chainId)
    sendTransaction({
      to: account,
      value: utils.toWei(0, 'ether'),
      data: utils.stringToHex(str.replace(/\s*/g, '')),
      chainId,
    })
  }

  const onredeem = async (amount: string) => {
    await redeem(amount, '259200')
  }
  const oncancelRedeem = async (index: number) => {
    await cancelRedeem(index)
  }

  const onfinalizeRedeem = async (index: number) => {
    await finalizeRedeem(index)
  }

  return {
    ontransfer: transfer,
    onredeem,
    oncancelRedeem,
    onfinalizeRedeem,
    cancelReddemLoading: cancelRedeemState.status === 'Mining',
    finalizeRedeemLoading: finalizeRedeemState.status === 'Mining',
    transferLoading: state.status === 'Mining',
    redeemLoading: redeemState.status === 'Mining',
  }
}

export const useStakeInscriptionInfo = () => {
  const { account } = useEthers()
  const stakeContract = useStakeInscriptionContract()

  const [balance, totalSupply] = (useContractCalls([
    {
      address: stakeContract.address,
      abi: stakeContract.interface,
      method: 'balanceOf',
      args: [account],
    },
    {
      address: stakeContract.address,
      abi: stakeContract.interface,
      method: 'totalSupply',
      args: [],
    },
  ]) ?? []) as Result

  return {
    balance: balance ? balance.toString() : undefined,
    totalSupply: totalSupply ? totalSupply.toString() : undefined,
  }
}

export const useRedeemInfo = () => {
  const { account } = useEthers()
  const blocknumber = useBlockNumber()
  const stakeContract = useStakeInscriptionContract()

  const [poolNum, setpoolNum] = useState<any>()

  const data = () => {
    stakeContract
      .getUserRedeemsLength(account)
      .then((res: any) => {
        setpoolNum(res.toNumber())
      })
      .catch(() => {
        // setpoolNum(0)
      })
  }

  useEffect(() => {
    if (!stakeContract || !account) return
    data()
  }, [stakeContract, account, blocknumber])

  // const { value: poolNum, error } =
  //   useCall(
  //     stakeContract &&
  //       account && {
  //         contract: stakeContract,
  //         method: 'getUserRedeemsLength',
  //         args: [account],
  //       },
  //     { refresh: 'everyBlock' }
  //   ) ?? {}

  const redeemInfo: any = useContractCalls(
    Array(poolNum || 0)
      .fill(1)
      .map((_, index) => ({
        address: stakeContract.address,
        abi: stakeContract.interface,
        method: 'getUserRedeem',
        args: [account, index],
      })),
    { refresh: 'everyBlock' }
  )

  return redeemInfo as undefined | { amount: BigNumber; endTime: BigNumber }[]
}
