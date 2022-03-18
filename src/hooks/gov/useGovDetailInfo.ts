import { useContractCalls, useEthers } from '@usedapp/core'
import { useGovernanceContract, useGovernanceContractReadonly } from '../useContract'
import { Result } from '@ethersproject/abi'
import { useEffect, useMemo, useState } from 'react'

export default function useGovDetailInfo(proposalId: string) {
  const { account } = useEthers()
  const govContract = useGovernanceContract()

  const [proposalResult, votesResult, stateResult] = (useContractCalls([
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
      method: 'state',
      args: [proposalId],
    },
  ]) ?? []) as Result[]

  const [voteRecords, setVoteRecords] = useState<any[] | undefined>(undefined)
  const govContractReadonly = useGovernanceContractReadonly()
  useEffect(() => {
    (async () => {
      const filter = govContractReadonly.filters.VoteCast(null, null)
      const events = await govContractReadonly.queryFilter(filter)
      console.log(events)
      const rows = events.map(i => ({
        proposalId: i.args?.proposalId?.toString(),
        proposer: i.args?.proposer?.toString(),
        startTime: i.args?.startTime?.toNumber(),
        endTime: i.args?.endTime?.toNumber(),
        description: i.args?.description.toString(),
      }))
      console.log(rows)
      setVoteRecords(rows)
    })()
  }, [govContractReadonly])
  const state: 'Active' | 'Defeated' | 'Succeeded' | 'Invalid' | 'Refunded' = ['Active', 'Defeated', 'Succeeded', 'Invalid', 'Refunded'][stateResult?.[0]] as any

  const myCanVote = useMemo(() => {
    return state === 'Active'
  }, [state])

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
    state,
    voteRecords,
    myCanVote,
  }
}
