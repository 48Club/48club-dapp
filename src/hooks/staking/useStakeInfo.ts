import { useContractCalls, useEthers, useTokenBalance } from '@usedapp/core'
import useERC20Contract, { useStakingContract } from '../useContract'
import BigNumber from 'bignumber.js'
import { KogeAddress } from '../../constants/contracts'
import { Result } from '@ethersproject/abi'

export default function useStakeInfo() {
  const { account } = useEthers()
  const kogeContract = useERC20Contract(KogeAddress)!
  const stakingContract = useStakingContract()
  const tokenBalance = useTokenBalance(KogeAddress, account)

  const [totalSupplyResult, decimalsResult, totalStakesResult, myStakeResult, userInfosResult, unstakeDelayResult] = (useContractCalls([
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
      method: 'getStake',
      args: [account],
    },
    {
      address: stakingContract.address,
      abi: stakingContract.interface,
      method: 'userInfos',
      args: [account],
    },
    {
      address: stakingContract.address,
      abi: stakingContract.interface,
      method: 'unstakeDelay',
      args: [],
    },
  ]) ?? []) as Result[]

  return {
    decimals: decimalsResult ? new BigNumber(decimalsResult.toString()).toNumber() : undefined,
    totalSupply: totalSupplyResult ? new BigNumber(totalSupplyResult.toString()) : undefined,
    totalStakes: totalStakesResult ? new BigNumber(totalStakesResult.toString()) : undefined,
    myTokenBalance: tokenBalance ? new BigNumber(tokenBalance.toString()) : undefined,
    myStakeBalance: myStakeResult ? new BigNumber(myStakeResult.toString()) : undefined,
    unlockTime: (userInfosResult?.lastStakeTime?.toNumber() && unstakeDelayResult) ? parseInt(userInfosResult.lastStakeTime.toString()) + parseInt(unstakeDelayResult.toString()) : undefined,
  }
}
