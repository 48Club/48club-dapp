import { useContractCalls, useEthers } from '@usedapp/core'
import { useGovernanceContract } from '../useContract'
import { Result } from '@ethersproject/abi'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { TEN_POW } from '@funcblock/dapp-sdk'

export default function useGovDetailInfo(proposalId: string) {
  const { account } = useEthers()
  const govContract = useGovernanceContract()

  const [proposalResult, votesResult, myVoteInfoResult, stateResult, rewardInfoResult, quorumThresholdResult] = (useContractCalls([
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'proposals',
      args: [proposalId],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'proposalVotes',
      args: [proposalId],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'proposalVoteInfo',
      args: [proposalId, account],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'state',
      args: [proposalId],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'getClaimableRewardInfo',
      args: [account, proposalId],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'quorumThresholdBps',
      args: [],
    },
  ]) ?? []) as Result[]

  const state: 'Active' | 'Defeated' | 'Succeeded' | 'Invalid' | 'Refunded' = ['Active', 'Defeated', 'Succeeded', 'Invalid', 'Refunded'][stateResult?.[0]] as any

  const myCanVote = useMemo(() => {
    return state === 'Active'
  }, [state])
  return {
    loading: !proposalResult || !votesResult,
    proposer: proposalResult?.proposer.toString(),
    proposerRewardClaimed: proposalResult?.proposerRewardClaimed.toString(),
    refunded: proposalResult?.refunded.toString(),
    totalReward: proposalResult?.totalReward.toString(),
    totalStakeAtStart: proposalResult?.totalStakeAtStart.toString(),
    voteEnd: proposalResult?.voteEnd.toString(),
    voteStart: proposalResult?.voteStart.toString(),
    againstVotes: new BigNumber(votesResult?.againstVotes.toString()).div(TEN_POW(18)).toNumber(),
    forVotes: new BigNumber(votesResult?.forVotes.toString()).div(TEN_POW(18)).toNumber(),
    state,
    quorum: quorumThresholdResult?.[0]?.toNumber(),
    myCanVote,
    myReward: new BigNumber(rewardInfoResult?.claimableAmount.toString()),
    myVotes: new BigNumber(myVoteInfoResult?.[0].weight.toString()),
    myVoteType: myVoteInfoResult?.[0].voteType
  }
}
