import { useContractCalls, useEthers } from '@usedapp/core'
import { useGovernanceContract, useGovernanceContractReadonly, useGovernanceContractNewReadonly, useGovernanceNewContract } from '../useContract'
import BigNumber from 'bignumber.js'
import { Result } from '@ethersproject/abi'
import { useEffect, useMemo, useState } from 'react'
import { START_BLOCK_NUMBER } from '../../constants/contracts'

export default function useGovInfo() {
  const { account } = useEthers()
  const govContract = useGovernanceContract()
  const govNewContract = useGovernanceNewContract()
  const [minDepositResult, rewardResult] = (useContractCalls([
    {
      address: govNewContract.address,
      abi: govNewContract.interface,
      method: 'minDeposit',
      args: [],
    },
    {
      address: govNewContract.address,
      abi: govNewContract.interface,
      method: 'calcRewardFromPool',
      args: [],
    },
  ]) ?? []) as Result[]
  const [records, setRecords] = useState<any[] | undefined>(undefined)
  const govContractReadonly = useGovernanceContractReadonly()
  const govContractNewReadonly = useGovernanceContractNewReadonly()
  useEffect(() => {
    (async () => {
      const titles = await (await fetch('/static/voting.title.json')).json()
      const createdFilter = govContractReadonly.filters.ProposalCreated(null, null)
      const events = await govContractReadonly.queryFilter(createdFilter, START_BLOCK_NUMBER)
      const rows = events.map(i => ({
        address: i.address?.toString(),
        proposalId: i.args?.proposalId?.toString(),
        proposer: i.args?.proposer?.toString(),
        startTime: i.args?.startTime?.toNumber(),
        endTime: i.args?.endTime?.toNumber(),
        ntitle: (() => {
          const _tmp_id = i.args?.proposalId?.toString()
          if (titles[_tmp_id]) {
            return titles[_tmp_id]
          }
          return ''
        })(),
        description: i.args?.description?.toString(),
      }))
      setRecords(rows.reverse())
    })()
  }, [govContractReadonly])
  // useEffect(() => {
  //   (async () => {
  //     const createdFilter = govContractReadonly.filters.ProposalCreated(null, null)
  //     const events = await govContractReadonly.queryFilter(createdFilter, START_BLOCK_NUMBER)
  //     console.log(events, 'events')
  //     const rows = events.map(i => ({
  //       address: i.address?.toString(),
  //       proposalId: i.args?.proposalId?.toString(),
  //       proposer: i.args?.proposer?.toString(),
  //       startTime: i.args?.startTime?.toNumber(),
  //       endTime: i.args?.endTime?.toNumber(),
  //       ntitle: '',
  //       description: i.args?.description?.toString(),
  //     }))
  //     setRecords(rows.reverse())
  //   })()
  // }, [govContractReadonly])

  const rewardResults = useContractCalls((records ?? []).map(i => {
    const contract = i.proposalId > 165 ? govNewContract : govContract
    return {
      address: contract.address,
      abi: contract.interface,
      method: 'getClaimableRewardInfo',
      args: [account, i.proposalId],
    }
  }) ?? []) as Result[]

  return {
    minDeposit: minDepositResult ? new BigNumber(minDepositResult[0].toString()) : undefined,
    reward: rewardResult ? new BigNumber(rewardResult[0].toString()) : undefined,
    proposals: useMemo(() => {
      if (!records) {
        return
      }
      return records.map((i, index) => ({
        ...i,
        claimable: new BigNumber(rewardResults[index]?.claimableAmount?.toString() ?? 0).gt(0),
      }))
    }, [records, rewardResults]),
  }
}
