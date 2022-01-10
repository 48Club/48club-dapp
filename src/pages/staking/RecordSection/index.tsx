import { Button } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'

export default function RecordSection() {
  const { t } = useTranslation()
  const record = [1, 2, 3]
  return (
    <div className="flex flex-col my-20">
      <Label text={t('pledge_details_record')} />
      <div className="mt-6 px-6 shadow">
        {record.length > 0 ? (
          <div>
            {record.map((item) => {
              return (
                <div className="py-6 flex flex-col border-b border-gray" key={item}>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">{t('address')}</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      0x3050dc66df3253b27eda28529fea26abfb19e4ddfbf45d65632bca3a44cd114c
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">{t('pledge_operation')}</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      {t('pledge_tokens')}
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">{t('amount')}</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      194.23
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="ctext-gray">{t('date')}</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      2021-11-12 10:23:22
                    </span>
                  </div>
                </div>
              )
            })}
            <div className="py-10 text-center">
              <Button className="h-9 text-sm font-medium rounded text-light-black bg-gray">
                {t('see_more')}
              </Button>
            </div>
          </div>
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
