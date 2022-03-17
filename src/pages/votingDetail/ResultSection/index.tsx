import { CheckCircleFilled, CloseCircleFilled, FrownFilled } from '@ant-design/icons'
import Label from 'components/Label'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import { useParams } from 'react-router-dom'

export default function ResultSection() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { againstVotes, forVotes } = useGovDetailInfo(id)
  return (
    <div className="pt-20 w-full">
      <Label text="投票结果" />

      <div className="mt-6 flex flex-col px-6 pb-8 shadow">
        <div className="flex flex-row mt-6 pb-4 border-b border-gray">
          <FrownFilled className="text-base text-gray mr-2.5" />
          <span className="text-base text-dark-gray">
            该提案未达到有效标准，提案总票数小于237 KOGE
          </span>
        </div>
        <div className="flex flex-col mt-8">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row">
              <CheckCircleFilled className="mr-2.5 text-green text-base" />
              <span className="text-black text-sm leading-6">Approve</span>
            </div>
            <span className="text-black text-sm">{forVotes}</span>
          </div>
          <div className="mt-2.5 w-full relative">
            <div className="h-6 rounded-xl bg-green opacity-10">&nbsp;</div>
            <div className="px-1 absolute left-0 top-1 w-full">
              <div className=" bg-green h-4 rounded-xl" style={{ width: `${100 * forVotes / (forVotes + againstVotes)}%`, borderRadius: '0.75rem' }}>&nbsp;</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-10">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row">
              <CloseCircleFilled className="mr-2.5 text-red text-base" />
              <span className="text-black text-sm leading-6">Reject</span>
            </div>
            <span className="text-black text-sm">{againstVotes}</span>
          </div>
          <div className="mt-2.5 w-full relative">
            <div className="h-6 rounded-xl bg-red opacity-10">&nbsp;</div>
            <div className="px-1 absolute left-0 top-1 w-full">
              <div className=" bg-red h-4 rounded-xl" style={{ width: `${100 * againstVotes / (forVotes + againstVotes)}%`, borderRadius: '0.75rem' }}>&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
