import { useCallback } from 'react'
import { useContractFunction, useEthers } from '@usedapp/core'
import { useGovernanceContract } from '../useContract'


export default function useGov() {
  const { account } = useEthers()
  const govContract = useGovernanceContract()
  const { send: propose, state: proposeState } = useContractFunction(govContract, 'propose', { transactionName: 'Propose' })
  const { send: vote, state: voteState } = useContractFunction(govContract, 'castVote', { transactionName: 'Vote' })
  const { send: claim, state: claimState } = useContractFunction(govContract, 'claimReward', { transactionName: 'Claim Reward' })
  const { send: refund, state: refundState } = useContractFunction(govContract, 'refundInvalidProposal', { transactionName: 'Refund Invalid Proposal' })

  const onPropose = useCallback(async (tokenId: string, deposit: string, description: string) => {
    console.info('Propose', tokenId, deposit, description)
    await propose(tokenId, deposit, description)
  }, [propose])

  const onVote = useCallback(async (proposalId, support: 0 | 1, reason: string = '') => {
    console.info('Vote', proposalId, support, reason)
    await vote(proposalId, support, reason)
  }, [vote])

  const onClaim = useCallback(async (proposalId) => {
    console.info('Claim', proposalId)
    await claim(proposalId)
  }, [claim])

  const onRefund = useCallback(async (proposalId) => {
    console.info('Refund', proposalId)
    await refund(proposalId)
  }, [refund])

  return {
    onPropose,
    onVote,
    onClaim,
    onRefund,
  }
}
