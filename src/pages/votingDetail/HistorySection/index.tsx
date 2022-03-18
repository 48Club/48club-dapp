import React from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import { useParams } from 'react-router-dom'

export default function HistorySection() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { voteRecords } = useGovDetailInfo(id)

  if (!voteRecords) {
    return null
  }

  return (
    <div className="flex flex-col my-20">
      <Label text="Voting details" />
      <div className="mt-6 px-6 shadow">
        {voteRecords.length > 0 ? (
          <div>
            {voteRecords.map((item) => {
              return (
                <div className="py-6 flex flex-col border-b border-gray">
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">地址</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      0x3050dc66df3253b27eda28529fea26abfb19e4ddfbf45d65632bca3a44cd114c
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">投票结果</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      YES
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">KOGE数量</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      194.23
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">日期</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      2021-11-12 10:23:22
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img src="/static/staking-no-records.png" className="mb-6" alt="" />
            <span className="text-base text-gray">No data</span>
          </div>
        )}
      </div>
    </div>
  )
}
