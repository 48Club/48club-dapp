import { useGovernanceContractReadonly, useGovernanceContractNewReadonly } from '../useContract'
import { utils } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { START_BLOCK_NUMBER } from '../../constants/contracts'

export default function useGovDetailVotes(proposalId: string, notInitRecords?: boolean) {
  const [voteRecords, setVoteRecords] = useState<any[] | undefined>(undefined)
  const govContractReadonly = useGovernanceContractReadonly()
  const govNewContractReadonly = useGovernanceContractNewReadonly()
  const reloadVoteRecords = useCallback(async () => {
    setVoteRecords(undefined)
    const contract = +proposalId > 165 ? govNewContractReadonly : govContractReadonly
    const filter = contract.filters.VoteCast(null, utils.hexlify(parseInt(proposalId)))
    const events = await contract.queryFilter(filter, START_BLOCK_NUMBER)
    const rows = events.map(i => ({
      proposalId: i.args?.proposalId?.toString(),
      reason: (() => {
        try {
          return i.args?.reason?.toString()
        } catch (error) {
          return ''
        }
      })(),
      support: i.args?.support?.toString(),
      voter: i.args?.voter?.toString(),
      weight: i.args?.weight?.toString(),
      blockNumber: i.blockNumber,
    }))
    setVoteRecords(rows)
  }, [govContractReadonly, proposalId, govNewContractReadonly])

  useEffect(() => {
    if (notInitRecords) {
      return
    }
    reloadVoteRecords().catch(console.error)
  }, [reloadVoteRecords])

  return {
    voteRecords,
    reloadVoteRecords,
  }
}
