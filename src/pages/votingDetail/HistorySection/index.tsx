import React from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import { useParams } from 'react-router-dom'
import { formatAmount } from '@funcblock/dapp-sdk'

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
            {voteRecords.map((i) => {
              return (
                <div className="py-6 flex flex-col border-b border-gray">
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">Address</span>
                    <span className="break-words text-right text-light-black">
                      {i.voter}
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">Result</span>
                    <span className="break-words text-right">
                      {i.support === '1' ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">KOGE</span>
                    <span className="break-words text-right">
                      {formatAmount(i.weight, 18)}
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="text-gray">Block number</span>
                    <span className="break-words text-right">
                      {i.blockNumber}
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
