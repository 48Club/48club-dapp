import { useCallback } from 'react'
import { useContractFunction, useEthers } from '@usedapp/core'
import { useGovernanceContract } from '../useContract'


export default function useGov() {
  const { account } = useEthers()
  const govContract = useGovernanceContract()
  const { send: propose, state: proposeState } = useContractFunction(govContract, 'propose', { transactionName: 'Propose' })
  const { send: vote, state: voteState } = useContractFunction(govContract, 'castVote', { transactionName: 'Vote' })

  const onPropose = useCallback(async (tokenId: string, deposit: string, description: string) => {
    console.info('Propose', tokenId, deposit, description)
    await propose(tokenId, deposit, description)
  }, [propose])

  const onVote = useCallback(async (proposalId, support: 0 | 1, reason: string = '') => {
    console.info('Vote', proposalId, support, reason)
    await vote(proposalId, support, reason)
  }, [propose])

  return {
    onPropose,
    onVote,
  }
}
