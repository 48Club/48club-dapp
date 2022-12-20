import Tag from 'components/Tag'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import { useParams } from 'react-router-dom'
import { formatAmount, shorten } from '@funcblock/dapp-sdk'
import moment from 'moment'
import { Spin } from 'antd'
import useGovInfo from '../../../hooks/gov/useGovInfo'

export default function HeaderSection() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { proposals } = useGovInfo()
  const { proposer, voteEnd, voteStart, state, totalReward } = useGovDetailInfo(id)
  const detail = proposals?.find(i => i.proposalId === id)
  const ntitle = (detail?.ntitle) === '' ? (detail?.description.slice(0, 20)) : (detail?.ntitle)

  return (
    <Spin className="pt-4 w-full mb-10" spinning={!detail}>
      <div
        className="flex flex-col rounded-2xl items-center px-6 pt-8 pb-10 px-8 md:px-20 bg-another-white md:mt-8"
        style={{ backgroundColor: '#FFFBEC' }}
      >
        <div className="flex flex-col items-center mb-4 md:flex-row">
          <div className="font-bold text-2xl mb-4 text-light-black md:mb-0 md:mr-4 md:text-4xl">
            {ntitle}
          </div>
          <Tag type={state} />
        </div>
        <div className="w-full mb-4 text-base text-dark-gray pb-6 border-b border-gray text-left md:pb-8 md:border-none md:mb-0 break-word break-all">
          {detail?.description.split('\n').map((item, index) => (index === 0) ? item : [<br key={index} />, item])}
        </div>
        <div className="w-full md:flex md:justify-between">
          <div className="flex flex-row justify-between py-2 text-sm w-full md:flex-col md:w-auto md:py-0">
            <span className="text-dark-gray md:mb-2">{t('author')}</span>
            <span className="font-medium text-light-black">{shorten(proposer, 8)}</span>
          </div>
          <div className="flex flex-row justify-between py-2 text-sm w-full md:flex-col md:w-auto md:py-0">
            <span className="text-dark-gray md:mb-2">{t('start_time')}</span>
            <span className="font-medium text-light-black">{moment.unix(voteStart).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className="flex flex-row justify-between py-2 text-sm w-full md:flex-col md:w-auto md:py-0">
            <span className="text-dark-gray md:mb-2">{t('end_time')}</span>
            <span className="font-medium text-light-black">{moment.unix(voteEnd).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className="flex flex-row justify-between py-2 text-sm w-full md:flex-col md:w-auto md:py-0">
            <span className="text-dark-gray md:mb-2">{t('total_reward')}</span>
            <span className="font-medium text-light-black">{formatAmount(totalReward, 18)} KOGE</span>
          </div>
        </div>
      </div>
    </Spin>
  )
}
