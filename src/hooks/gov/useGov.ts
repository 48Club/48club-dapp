import { createContext, useCallback } from 'react'
import { useContractFunction } from '@usedapp/core'
import { useGovernanceContract, useGovernanceNewContract } from '../useContract'


export default function useGov() {
  // const { account } = useEthers()
  const govContract = useGovernanceContract()
  const govNewContract = useGovernanceNewContract()
  const { send: propose, state: proposeState } = useContractFunction(govNewContract, 'propose', { transactionName: 'Propose' })
  const { send: vote, state: voteState } = useContractFunction(govContract, 'castVote', { transactionName: 'Vote' })
  const { send: claim, state: claimState } = useContractFunction(govContract, 'claimReward', { transactionName: 'Claim Reward' })
  const { send: refund, state: refundState } = useContractFunction(govContract, 'refundInvalidProposal', { transactionName: 'Refund Invalid Proposal' })
  const { send: voteNew, state: voteStateNew } = useContractFunction(govNewContract, 'castVote', { transactionName: 'Vote' })
  const { send: claimNew, state: claimStateNew } = useContractFunction(govNewContract, 'claimReward', { transactionName: 'Claim Reward' })
  const { send: refundNew, state: refundStateNew } = useContractFunction(govNewContract, 'refundInvalidProposal', { transactionName: 'Refund Invalid Proposal' })

  const onPropose = useCallback(async (tokenId: string, deposit: string, title: string, description: string) => {
    console.info('Propose', tokenId, deposit, title, description)
    await propose(tokenId, deposit, title, description)
  }, [propose])

  const onVote = useCallback(async (proposalId: any, support: 0 | 1, reason: string = '') => {
    console.info('Vote', proposalId, support, reason)
    if (+proposalId > 165) {
      await voteNew(proposalId, support, reason)
    } else {
      await vote(proposalId, support, reason)
    }
  }, [vote, voteNew])

  const onClaim = useCallback(async (proposalId: any) => {
    console.info('Claim', proposalId)
    if (+proposalId > 165) {
      await claimNew(proposalId)
    } else {
      await claim(proposalId)
    }
    
  }, [claim, claimNew])

  const onRefund = useCallback(async (proposalId: any) => {
    console.info('Refund', proposalId)
    if (+proposalId > 165) {
      await refundNew(proposalId)
    } else {
      await refund(proposalId)
    }
    
  }, [refund, refundNew])

  return {
    onPropose,
    proposeLoading: proposeState.status === 'Mining',
    onVote,
    voteLoading: voteState.status === 'Mining',
    onClaim,
    claimLoading: claimState.status === 'Mining',
    onRefund,
    refundLoading: refundState.status === 'Mining',
  }
}

export const GovInfoFilterContext = createContext({
  status: 'all',
  timeRanges: [],
  related: false,
  claimable: false,
  voted: false,
})

export const GovSetFilterContext = createContext<{
  setStatus: any,
  setTimeRanges: any,
  setRelated: any,
  setClaimable: any,
  setVoted: any
}>({
  setStatus: () => {
  },
  setTimeRanges: () => {
  },
  setRelated: () => {
  },
  setVoted: () => {
  },
  setClaimable: () => {
  },
})
