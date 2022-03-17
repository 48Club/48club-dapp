import { useContractCalls, useEthers } from '@usedapp/core'
import { useGovernanceContract } from '../useContract'
import { Result } from '@ethersproject/abi'

export default function useGovDetailInfo(proposalId: string) {
  const { account } = useEthers()
  const govContract = useGovernanceContract()

  const [proposalResult, votesResult] = (useContractCalls([
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
  ]) ?? []) as Result[]

  return {
    proposer: proposalResult?.proposer.toString(),
    proposerRewardClaimed: proposalResult?.proposerRewardClaimed.toString(),
    refunded: proposalResult?.refunded.toString(),
    totalReward: proposalResult?.totalReward.toString(),
    totalStakeAtStart: proposalResult?.totalStakeAtStart.toString(),
    voteEnd: proposalResult?.voteEnd.toString(),
    voteStart: proposalResult?.voteStart.toString(),
    againstVotes: votesResult?.againstVotes.toNumber(),
    forVotes: votesResult?.forVotes.toNumber(),
  }
}
