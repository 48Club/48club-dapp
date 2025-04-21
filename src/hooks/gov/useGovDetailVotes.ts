import { useGovernanceContractReadonly } from '../useContract'
import { utils } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { START_BLOCK_NUMBER } from '../../constants/contracts'

export default function useGovDetailVotes(proposalId: string, notInitRecords?: boolean) {
  const [voteRecords, setVoteRecords] = useState<any[] | undefined>(undefined)
  const govContractReadonly = useGovernanceContractReadonly()
  const reloadVoteRecords = useCallback(async () => {
    setVoteRecords(undefined)
    const filter = govContractReadonly.filters.VoteCast(null, utils.hexlify(parseInt(proposalId)))
    const events = await govContractReadonly.queryFilter(filter, START_BLOCK_NUMBER)
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
  }, [govContractReadonly, proposalId])

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
