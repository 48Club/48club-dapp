import { useContractCall, useContractCalls, useEthers, useTokenBalance } from '@usedapp/core'
import useERC20Contract, { useStakingContract } from '../useContract'
import BigNumber from 'bignumber.js'
import { KogeAddress } from '../../constants/contracts'
import { Result } from '@ethersproject/abi'
import moment from 'moment'

export default function useStakeInfo() {
  const { account } = useEthers()
  const kogeContract = useERC20Contract(KogeAddress)!
  const stakingContract = useStakingContract()
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

  const userInfos = (useContractCall(account &&
    {
      address: stakingContract.address,
      abi: stakingContract.interface,
      method: 'userInfos',
      args: [account],
    }) ?? {}) as Result

  const {
    lastStakeTime,
    lastUnstakeTime,
    stake: stakedAmount,
    lockedUnstakedAmount,
    unlockedUnstakedAmount,
  } = userInfos

  const withdrawTime = (lastUnstakeTime && withdrawDelayResult) ? parseInt(lastUnstakeTime.toString()) + parseInt(withdrawDelayResult.toString()) : undefined
  const withdrawMoment = withdrawTime ? moment(withdrawTime * 1000) : undefined
  const canWithdraw = (withdrawMoment && withdrawMoment.isBefore(moment()))
  const myLockedUnstakeBalance = lockedUnstakedAmount ? new BigNumber(lockedUnstakedAmount.toString()) : undefined
  const myUnlockedUnstakeBalance = unlockedUnstakedAmount ? new BigNumber(unlockedUnstakedAmount.toString()) : undefined

  return {
    decimals: decimalsResult ? new BigNumber(decimalsResult.toString()).toNumber() : undefined,
    totalSupply: totalSupplyResult ? new BigNumber(totalSupplyResult.toString()) : undefined,
    totalStakes: totalStakesResult ? new BigNumber(totalStakesResult.toString()) : undefined,
    myTokenBalance: tokenBalance ? new BigNumber(tokenBalance.toString()) : undefined,
    myStakeBalance: stakedAmount ? new BigNumber(stakedAmount.toString()) : undefined,
    myLockedUnstakeBalance: canWithdraw ? 0 : myLockedUnstakeBalance,
    myUnlockedUnstakeBalance: canWithdraw ? myUnlockedUnstakeBalance?.plus(myLockedUnstakeBalance ?? 0) : myUnlockedUnstakeBalance,
    unstakeDelay: unstakeDelayResult ? new BigNumber(unstakeDelayResult.toString()).toNumber() : 0,
    unstakeTime: (lastStakeTime && unstakeDelayResult) ? parseInt(lastStakeTime.toString()) + parseInt(unstakeDelayResult.toString()) : undefined,
    withdrawDelay: withdrawDelayResult ? new BigNumber(withdrawDelayResult.toString()).toNumber() : 0,
    withdrawTime,
  }
}
