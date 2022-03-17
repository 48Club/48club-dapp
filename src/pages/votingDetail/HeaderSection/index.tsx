import Tag from 'components/Tag'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import { useParams } from 'react-router-dom'
import { useGovernanceContractReadonly } from '../../../hooks/useContract'
import { shorten } from '@funcblock/dapp-sdk'
import moment from 'moment'

export default function HeaderSection() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { proposer, proposerRewardClaimed, refunded, totalReward, totalStakeAtStart, voteEnd, voteStart } = useGovDetailInfo(id)

  const [records, setRecords] = useState<any[]>([])
  const govContractReadonly = useGovernanceContractReadonly()
  useEffect(() => {
    (async () => {
      const createdFilter = govContractReadonly.filters.ProposalCreated(null, null)
      const events = await govContractReadonly.queryFilter(createdFilter)
      const rows = events.map(i => ({
        proposalId: i.args?.proposalId?.toString(),
        proposer: i.args?.proposer?.toString(),
        startTime: i.args?.startTime?.toNumber(),
        endTime: i.args?.endTime?.toNumber(),
        description: i.args?.description.toString(),
      }))
      setRecords(rows)
    })()
  }, [govContractReadonly])
  const detail = records.find(i => i.proposalId === id)

  return (
    <div className="pt-4 w-auto mb-10">
      <div
        className="flex flex-col rounded-2xl items-center px-6 pt-8 pb-10 bg-another-white"
        style={{ backgroundColor: '#FFFBEC' }}
      >
        <span className="font-bold text-2xl mb-4 text-light-black">
          {detail?.description.slice(0, 20)}
        </span>
        <Tag type="doing" />
        <span className="text-base mt-4 text-dark-gray pb-6 border-b border-gray text-center">
          {detail?.description}
        </span>
        <div className="mt-6 flex flex-row justify-between text-sm w-full">
          <span className="text-dark-gray">Author</span>
          <span className="font-medium text-light-black">{shorten(proposer, 8)}</span>
        </div>
        <div className="mt-4 flex flex-row justify-between text-sm w-full">
          <span className="text-dark-gray">Start time</span>
          <span className="font-medium text-light-black">{moment.unix(voteStart).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div className="mt-4 flex flex-row justify-between text-sm w-full">
          <span className="text-dark-gray">End time</span>
          <span className="font-medium text-light-black">{moment.unix(voteEnd).format('YYYY-MM-DD HH:mm')}</span>
        </div>
      </div>
    </div>
  )
}
