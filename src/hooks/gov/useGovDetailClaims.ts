import { useGovernanceContractReadonly, useGovernanceContractNewReadonly } from '../useContract'
import { utils } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { START_BLOCK_NUMBER } from '../../constants/contracts'
import BigNumber from 'bignumber.js'

export default function useGovDetailClaims(proposalId: string) {
  const [records, setRecords] = useState<any[] | undefined>(undefined)
  const govContractReadonly = useGovernanceContractReadonly()
  const govContractNewReadonly = useGovernanceContractNewReadonly()

  const reloadClaimRecords = useCallback(async () => {
    setRecords(undefined)
    const contract = +proposalId > 165 ? govContractNewReadonly : govContractReadonly
    const filter = govContractReadonly.filters.RewardClaimed(null, utils.hexlify(parseInt(proposalId)))
    const events = await contract.queryFilter(filter, START_BLOCK_NUMBER)
    const rows = events.map(i => ({
      amount: new BigNumber(i.args?.amount?.toString() ?? 0),
      caller: i.args?.caller?.toString(),
    }))
    setRecords(rows)
  }, [govContractReadonly, proposalId])

  useEffect(() => {
    reloadClaimRecords().catch(console.error)
  }, [reloadClaimRecords])

  return {
    claimRecords: records,
    reloadClaimRecords,
  }
}
