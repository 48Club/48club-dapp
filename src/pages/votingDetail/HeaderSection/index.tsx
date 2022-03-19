import Tag from 'components/Tag'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import { useParams } from 'react-router-dom'
import { shorten } from '@funcblock/dapp-sdk'
import moment from 'moment'
import { Spin } from 'antd'
import useGovInfo from '../../../hooks/gov/useGovInfo'

export default function HeaderSection() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { proposals } = useGovInfo()
  const { proposer, voteEnd, voteStart, state } = useGovDetailInfo(id)
  const detail = proposals?.find(i => i.proposalId === id)

  return (
    <Spin className="pt-4 w-full mb-10" spinning={!detail}>
      <div
        className="flex flex-col rounded-2xl items-center px-6 pt-8 pb-10 bg-another-white"
        style={{ backgroundColor: '#FFFBEC' }}
      >
        <div className="font-bold text-2xl mb-4 text-light-black">
          {detail?.description.slice(0, 20)}
        </div>
        <Tag type={state} />
        <div className="text-base mt-4 text-dark-gray pb-6 border-b border-gray text-center">
          {detail?.description}
        </div>
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
    </Spin>
  )
}
