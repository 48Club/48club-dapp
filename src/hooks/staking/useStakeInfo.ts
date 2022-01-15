import { useContractCall, useContractCalls, useEthers, useTokenBalance } from '@usedapp/core'
import useERC20Contract, { useStakingContract, useStakingContractReadonly } from '../useContract'
import BigNumber from 'bignumber.js'
import { KogeAddress } from '../../constants/contracts'
import { Result } from '@ethersproject/abi'
import { useEffect, useState } from 'react'

export default function useStakeInfo() {
  const { account } = useEthers()
  const kogeContract = useERC20Contract(KogeAddress)!
  const stakingContract = useStakingContract()
  const stakingContractReadonly = useStakingContractReadonly()
  const tokenBalance = useTokenBalance(KogeAddress, account)

  const [totalSupplyResult, decimalsResult, totalStakesResult, unstakeDelayResult, withdrawDelayResult] = (useContractCalls([
    {
      address: kogeContract.address,
      abi: kogeContract.interface,
      method: 'totalSupply',
      args: [],
    },
    {
      address: kogeContract.address,
      abi: kogeContract.interface,
      method: 'decimals',
      args: [],
    },
    {
      address: stakingContract.address,
      abi: stakingContract.interface,
      method: 'totalStakes',
      args: [],
    },
    {
      address: stakingContract.address,
      abi: stakingContract.interface,
      method: 'unstakeDelay',
      args: [],
    },
    {
      address: stakingContract.address,
      abi: stakingContract.interface,
      method: 'withdrawDelay',
      args: [],
    },
  ]) ?? []) as Result[]

  const { lastStakeTime, lastUnstakeTime, stake: stakedAmount, unstakedAmount } = (useContractCall(account &&
    {
      address: stakingContract.address,
      abi: stakingContract.interface,
      method: 'userInfos',
      args: [account],
    }) ?? {}) as Result

  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      const stakedFilter = stakingContractReadonly.filters.Staked(null, null)
      const stakedEvents = await stakingContractReadonly.queryFilter(stakedFilter)
      const unstakedFilter = stakingContractReadonly.filters.Unstaked(null, null)
      const unstakedEvents = await stakingContractReadonly.queryFilter(unstakedFilter, 14389118)
      const rows = [...stakedEvents, ...unstakedEvents].map(i => ({
        blockNumber: i.blockNumber,
        event: i.event,
        user: i.args?.user,
        amount: new BigNumber(i.args?.amount.toString()),
      }))
      setRecords(rows)
    })()
  }, [])

  return {
    decimals: decimalsResult ? new BigNumber(decimalsResult.toString()).toNumber() : undefined,
    totalSupply: totalSupplyResult ? new BigNumber(totalSupplyResult.toString()) : undefined,
    totalStakes: totalStakesResult ? new BigNumber(totalStakesResult.toString()) : undefined,
    myTokenBalance: tokenBalance ? new BigNumber(tokenBalance.toString()) : undefined,
    myStakeBalance: stakedAmount ? new BigNumber(stakedAmount.toString()) : undefined,
    myUnstakeBalance: unstakedAmount ? new BigNumber(unstakedAmount.toString()) : undefined,
    unstakeTime: (lastStakeTime && unstakeDelayResult) ? parseInt(lastStakeTime.toString()) + parseInt(unstakeDelayResult.toString()) : undefined,
    withdrawTime: (lastUnstakeTime && withdrawDelayResult) ? parseInt(lastUnstakeTime.toString()) + parseInt(withdrawDelayResult.toString()) : undefined,
    records,
  }
}
