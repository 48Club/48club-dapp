import { useCallback, useEffect, useState } from 'react'
import { utils } from 'ethers'
import { Result } from '@ethersproject/abi'
import { useAirDropContract, useAirDropStatusContract } from '../useContract'
import { useContractCalls } from '@usedapp/core'

export default function useAirDrop() {
  const [airdropList, setAirdropList] = useState<any[] | undefined>(undefined)
  const airdropContract = useAirDropContract()
  const airdropStatusContract = useAirDropStatusContract()
  const loadAirdropEvent = useCallback(async (address: string) => {
    if (!address) {
      return
    }
    setAirdropList(undefined)
    // const addressBytes = utils.arrayify(address)
    // const addressHash = utils.sha256(addressBytes)
    const filter = airdropContract.filters.Airdrop(null, null, address)
    const events = await airdropContract.queryFilter(filter, 50988588)
    console.log(events, 'events')
    const rows = events.map((log: any) => ({
      token: log.args.token,
      eventID: log.args.eventID.toString(),
      recipient:  log.args.recipient,
      amount: utils.formatUnits(log.args.amount, 18).toString(),
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
    }))
    setAirdropList(rows)
  }, [airdropContract])

  return {
    airdropList,
    loadAirdropEvent,
  }
}
