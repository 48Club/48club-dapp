import { useGasInfoContractReadonly } from '../useContract'
import { useCallback, useEffect, useState } from 'react'
import { START_BLOCK_NUMBER } from '../../constants/contracts'

export default function useGasInfo() {
  const gasInfoContractReadonly = useGasInfoContractReadonly()
  const [depositRecords, setDepositRecords] = useState<any[] | undefined>(undefined)
  const [withdrawRecords, setWithdrawRecords] = useState<any[] | undefined>(undefined)
  const [authorizedSpendRecords, setAuthorizedSpendRecords] = useState<any[] | undefined>(undefined)

  const loadDepositRecords = useCallback(async (address: string) => {
    setDepositRecords(undefined)
    const contract = gasInfoContractReadonly
    const filter = contract.filters.Deposit(address, null)
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
      transactionHash: i.transactionHash
    }))
    setDepositRecords(rows)
  }, [gasInfoContractReadonly])
  const loadWithdrawRecords = useCallback(async (address: string) => {
    setWithdrawRecords(undefined)
    const contract = gasInfoContractReadonly
    const filter = contract.filters.Withdrawal(address, null)
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
      transactionHash: i.transactionHash
    }))
    setWithdrawRecords(rows)
  }, [gasInfoContractReadonly])
  const loadAuthorizedSpendRecords = useCallback(async (address: string) => {
    setAuthorizedSpendRecords(undefined)
    const contract = gasInfoContractReadonly
    const filter = contract.filters.SponsorPaid(address, null)
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
      transactionHash: i.transactionHash
    }))
    setAuthorizedSpendRecords(rows)
  }, [gasInfoContractReadonly])

  return {
    depositRecords,
    withdrawRecords,
    authorizedSpendRecords,
    loadDepositRecords,
    loadWithdrawRecords,
    loadAuthorizedSpendRecords,
  }
}
