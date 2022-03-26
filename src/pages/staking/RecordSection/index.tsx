import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'
import { formatAmount, shorten } from '@funcblock/dapp-sdk'
import BigNumber from 'bignumber.js'
import { useStakingContractReadonly } from '../../../hooks/useContract'
import { JsonRpcProvider } from '@ethersproject/providers'
import { READONLY_RPC_URL } from '../../../constants/env'

function Row({ data }: { data: any }) {
  return (
    <div className="mt-4 pt-4 pb-0 flex flex-row justify-between items-center border-t border-gray" key={data}>
      <div className="flex-1 block md:hidden">
        {shorten(data.user, 4, 4)}
      </div>
      <div className="flex-1 hidden md:block">
        {shorten(data.user, 8, 8)}
      </div>
      <div className="flex-1">
        {data.event}
      </div>
      <div className="flex-1">
        {formatAmount(data.amount, 18)}
      </div>
      <div className="flex-1 hidden md:block">
        {data.blockNumber}
      </div>
    </div>
  )
}

export default function RecordSection() {
  const { t } = useTranslation()

  const [records, setRecords] = useState<any[]>([])
  const stakingContractReadonly = useStakingContractReadonly()
  useEffect(() => {
    (async () => {
      const provider = new JsonRpcProvider(READONLY_RPC_URL)
      const blockNumber = await provider.getBlockNumber()
      const stakedFilter = stakingContractReadonly.filters.Staked(null, null)
      const stakedEvents = await stakingContractReadonly.queryFilter(stakedFilter, blockNumber - 7 * 24 * 3600)
      const unstakedFilter = stakingContractReadonly.filters.Unstaked(null, null)
      const unstakedEvents = await stakingContractReadonly.queryFilter(unstakedFilter, blockNumber - 7 * 24 * 3600)
      const rows = [...stakedEvents, ...unstakedEvents].map(i => ({
        blockNumber: i.blockNumber,
        event: i.event,
        user: i.args?.user,
        amount: new BigNumber(i.args?.amount.toString()),
      }))
      setRecords(rows.sort((a, b) => b.blockNumber - a.blockNumber).slice(0, 20))
    })()
  }, [stakingContractReadonly])

  return (
    <div className="flex flex-col my-20">
      <Label text={t('staking_details_record')} />
      <div className="mt-6 px-6 py-6 shadow rounded">
        <div className="flex flex-row justify-between items-center">
          <div className="flex-1 text-gray">{t('address')}</div>
          <div className="flex-1 text-gray">{t('staking_operation')}</div>
          <div className="flex-1 text-gray">{t('amount')}</div>
          <div className="flex-1 text-gray hidden md:block">{t('blocknumber')}</div>
        </div>
        {records.length > 0 ? (
          <>
            {records.map((i) => <Row key={i.blockNumber} data={i} />)}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img src="/static/staking-no-records.png" className="mb-6" alt="" />
            <span className="text-base text-gray">{t('no_records')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
