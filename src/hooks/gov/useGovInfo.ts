import { useContractCalls, useEthers } from '@usedapp/core'
import { useGovernanceContract, useGovernanceContractReadonly } from '../useContract'
import BigNumber from 'bignumber.js'
import { Result } from '@ethersproject/abi'
import { useEffect, useState } from 'react'

export default function useGovInfo() {
  const { account } = useEthers()
  const govContract = useGovernanceContract()

  // for filter
  const [related, setRelated] = useState(true)
  const [timeRanges, setTimeRanges] = useState<any>([])
  const [status, setStatus] = useState('all')

  const [minDepositResult] = (useContractCalls([
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'minDeposit',
      args: [],
    },
  ]) ?? []) as Result[]

  const [records, setRecords] = useState<any[] | undefined>(undefined)
  const govContractReadonly = useGovernanceContractReadonly()
  useEffect(() => {
    (async () => {
      const createdFilter = govContractReadonly.filters.ProposalCreated(null, null)
      const events = await govContractReadonly.queryFilter(createdFilter)
      const rows = events.map(i => ({
        address: i.address?.toString(),
        proposalId: i.args?.proposalId?.toString(),
        proposer: i.args?.proposer?.toString(),
        startTime: i.args?.startTime?.toNumber(),
        endTime: i.args?.endTime?.toNumber(),
        description: i.args?.description?.toString(),
      }))
      setRecords(rows.reverse())
    })()
  }, [govContractReadonly])

  return {
    minDeposit: minDepositResult ? new BigNumber(minDepositResult.toString()) : undefined,
    proposals: records,
    related,
    setRelated,
    timeRanges,
    setTimeRanges,
    status,
    setStatus,
  }
}
