import { useContractCalls } from '@usedapp/core'
import { useGovernanceContract, useGovernanceContractReadonly } from '../useContract'
import BigNumber from 'bignumber.js'
import { Result } from '@ethersproject/abi'
import { useEffect, useState } from 'react'
import { START_BLOCK_NUMBER } from '../../constants/contracts'

export default function useGovInfo() {
  const govContract = useGovernanceContract()

  const [minDepositResult, rewardResult] = (useContractCalls([
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'minDeposit',
      args: [],
    },
    {
      address: govContract.address,
      abi: govContract.interface,
      method: 'calcRewardFromPool',
      args: [],
    },
  ]) ?? []) as Result[]

  const [records, setRecords] = useState<any[] | undefined>(undefined)
  const govContractReadonly = useGovernanceContractReadonly()
  useEffect(() => {
    (async () => {
      let titles = await (await fetch("/static/voting.title.json")).json()
      const createdFilter = govContractReadonly.filters.ProposalCreated(null, null)
      const events = await govContractReadonly.queryFilter(createdFilter, START_BLOCK_NUMBER)
      const rows = events.map(i => ({
        address: i.address?.toString(),
        proposalId: i.args?.proposalId?.toString(),
        proposer: i.args?.proposer?.toString(),
        startTime: i.args?.startTime?.toNumber(),
        endTime: i.args?.endTime?.toNumber(),
        ntitle: (() => {
          let _tmp_id = i.args?.proposalId?.toString()
          if (titles[_tmp_id]) {
            return titles[_tmp_id]
          }
          return ""
        })(),
        description: i.args?.description?.toString(),
      }))
      setRecords(rows.reverse())
    })()
  }, [govContractReadonly])
  return {
    minDeposit: minDepositResult ? new BigNumber(minDepositResult[0].toString()) : undefined,
    reward: rewardResult ? new BigNumber(rewardResult[0].toString()) : undefined,
    proposals: records,
  }
}
