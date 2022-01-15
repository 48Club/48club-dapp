import React from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'
import { formatAmount, shorten } from '@funcblock/dapp-sdk'
import useStakeInfo from '../../../hooks/staking/useStakeInfo'

function Row({ data }: { data: any }) {
  return (
    <div className="mt-4 pt-4 pb-0 flex flex-row justify-between items-center border-t border-gray" key={data}>
      <div className="flex-1">
        {shorten(data.user, 8, 8)}
      </div>
      <div className="flex-1">
        {data.event}
      </div>
      <div className="flex-1">
        {formatAmount(data.amount, 18)}
      </div>
      <div className="flex-1">
        {data.blockNumber}
      </div>
    </div>
  )
}

export default function RecordSection() {
  const { t } = useTranslation()
  const { records } = useStakeInfo()
  return (
    <div className="flex flex-col my-20">
      <Label text={t('staking_details_record')} />
      <div className="mt-6 px-6 py-6 shadow rounded">
        <div className="flex flex-row justify-between items-center">
          <div className="flex-1 text-gray">{t('address')}</div>
          <div className="flex-1 text-gray">{t('staking_operation')}</div>
          <div className="flex-1 text-gray">{t('amount')}</div>
          <div className="flex-1 text-gray">{t('date')}</div>
        </div>
        {records.length > 0 ? (
          <>
            {records.slice(50).map((i) => <Row key={i.blockNumber} data={i} />)}
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
