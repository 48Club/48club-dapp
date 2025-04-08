import { useContractCalls, useEthers } from '@usedapp/core'
import { useGovernanceContract, useGovernanceContractReadonly, useGovernanceContractNewReadonly, useGovernanceNewContract } from '../useContract'
import BigNumber from 'bignumber.js'
import { Result } from '@ethersproject/abi'
import { useEffect, useMemo, useState } from 'react'
import { TEN_POW } from '@funcblock/dapp-sdk'
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
  const govContracNewtReadonly = useGovernanceContractNewReadonly()
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
  //     const createdFilter = govContracNewtReadonly.filters.ProposalCreated(null, null)
  //     const events = await govContracNewtReadonly.queryFilter(createdFilter, START_BLOCK_NUMBER)
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
  // }, [govContracNewtReadonly])


  const results = useContractCalls((records ?? []).flatMap(i => {
    const contract = i.proposalId > 165 ? govNewContract : govContract
    return [
      {
        address: contract.address,
        abi: contract.interface,
        method: 'getClaimableRewardInfo',
        args: [account, i.proposalId],
      },
      {
        address: contract.address,
        abi: contract.interface,
        method: 'proposalVotes',
        args: [i.proposalId],
      },
      {
        address: contract.address,
        abi: contract.interface,
        method: 'state',
        args: [i.proposalId],
      },
    ]
  }) ?? []) as Result[]
  const groupedResults: any[] = []
  for (let i = 0; i < results.length; i += 3) {
    groupedResults.push({
      claimableRewardInfo: results[i],
      votesResult: results[i + 1],
      state: results[i + 2]
    })
  }
  console.log(groupedResults, 'groupedResults', results.length)
  return {
    minDeposit: minDepositResult ? new BigNumber(minDepositResult[0].toString()) : undefined,
    reward: rewardResult ? new BigNumber(rewardResult[0].toString()) : undefined,
    proposals: useMemo(() => {
      if (!records) {
        return
      }
      return records.map((i, index) => ({
        ...i,
        claimable: new BigNumber(groupedResults[index]?.claimableRewardInfo?.claimableAmount?.toString() ?? 0).gt(0),
        votesResult: groupedResults[index].votesResult,
        againstVotes: new BigNumber(groupedResults[index].votesResult?.againstVotes.toString()).div(TEN_POW(18)).toNumber(),
        forVotes: new BigNumber(groupedResults[index].votesResult?.forVotes.toString()).div(TEN_POW(18)).toNumber(),
        state: groupedResults[index].state,
      }))
    }, [records, groupedResults]),
  }
}
