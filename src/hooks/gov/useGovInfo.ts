import { useContractCalls } from '@usedapp/core'
import { useGovernanceContract, useGovernanceContractReadonly } from '../useContract'
import BigNumber from 'bignumber.js'
import { Result } from '@ethersproject/abi'
import { useEffect, useState } from 'react'
import { JsonRpcProvider } from '@ethersproject/providers'
import { READONLY_RPC_URL } from '../../constants/env'

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
      const provider = new JsonRpcProvider(READONLY_RPC_URL)
      const blockNumber = await provider.getBlockNumber()
      const createdFilter = govContractReadonly.filters.ProposalCreated(null, null)
      const events = await govContractReadonly.queryFilter(createdFilter, blockNumber - 7 * 24 * 3600)
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
    minDeposit: minDepositResult ? new BigNumber(minDepositResult[0].toString()) : undefined,
    reward: rewardResult ? new BigNumber(rewardResult[0].toString()) : undefined,
    proposals: records,
  }
}
