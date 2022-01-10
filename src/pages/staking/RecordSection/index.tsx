import { Button } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'
import { shorten } from '@funcblock/dapp-sdk'

function Row({ data }: { data: any }) {
  const { t } = useTranslation()
  return (
    <div className="mt-4 pt-4 pb-0 flex flex-row justify-between items-center border-t border-gray" key={data}>
      <div className="flex-1">
        {shorten('0x3050dc66df3253b27eda28529fea26abfb19e4ddfbf45d65632bca3a44cd114c', 8, 8)}
      </div>
      <div className="flex-1">
        Stake
      </div>
      <div className="flex-1">
        194.23
      </div>
      <div className="flex-1">
        2021-11-12 10:23:22
      </div>
    </div>
  )
}

export default function RecordSection() {
  const { t } = useTranslation()
  const record = [1, 2, 3]
  return (
    <div className="flex flex-col my-20">
      <Label text={t('pledge_details_record')} />
      <div className="mt-6 px-6 py-6 shadow rounded">
        <div className='flex flex-row justify-between items-center'>
          <div className="flex-1 text-gray">{t('address')}</div>
          <div className="flex-1 text-gray">{t('pledge_operation')}</div>
          <div className="flex-1 text-gray">{t('amount')}</div>
          <div className="flex-1 text-gray">{t('date')}</div>
        </div>
        {record.length > 0 ? (
          <>
            {record.map((i) => <Row key={i} data={i} />)}
            <div className="py-10 text-center">
              <Button className="h-9 text-sm font-medium rounded text-light-black bg-gray">
                {t('see_more')}
              </Button>
            </div>
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
