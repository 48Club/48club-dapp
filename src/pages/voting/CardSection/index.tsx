import { CheckCircleTwoTone, ClockCircleFilled } from '@ant-design/icons'
import Tag from 'components/Tag'
import { NavLink } from 'react-router-dom'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { shorten } from '@funcblock/dapp-sdk'
import { useEthers } from '@usedapp/core'
import moment from 'moment'
import { Spin } from 'antd'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import useGovInfo from '../../../hooks/gov/useGovInfo'
import { GovInfoFilterContext } from '../../../hooks/gov/useGov'
import { TFunction } from 'i18next'

export default function CardSection() {
  const { proposals } = useGovInfo()

  return (
    <Spin spinning={!proposals} className="pt-4 w-full mb-20">
      {
        proposals?.map((item, index) => <Card item={item} key={index} />)
      }
    </Spin>
  )
}

function Card({ item }) {
  const { t } = useTranslation()
  const info = useGovDetailInfo(item.proposalId)
  const { state, voteEnd, voteStart, totalReward, proposer } = info
  const { status, related, timeRanges } = useContext(GovInfoFilterContext)
  const { account } = useEthers()

  return (
    <>
      {
        (status === 'all' || status === state)
        && (!related || (proposer === account))
        && (!timeRanges?.length || (moment.unix(voteStart).isAfter(timeRanges?.[0]) && moment.unix(voteStart).isBefore(timeRanges?.[1])))
        &&
        (<NavLink to={`/voting/detail/${item.proposalId}`} className="w-full mb-10 flex flex-col p-6 md:p-10 shadow rounded-lg">
          <div className="flex flex-col md:flex-row-reverse md:mb-2">
            <Tag type={state} className="min-w-16 h-7" />
            <div className="mb-2 mt-4 text-base leading-6 font-medium text-yellow md:flex-1 md:mt-0 md:mb-0">
              {t('author')}: {shorten(item.proposer)}
            </div>
          </div>
          <div className="font-bold text-xl leading-6 break-words mb-2 text-light-black">
            {item.description.slice(0, 20)}
          </div>
          <div className="break-words text-sm leading-5 mb-12 md:mb-9 text-dark-gray">
            {item.description}
          </div>
          <div className="mb-2 flex flex-col md:flex-row md:items-center">
            {getVoteStatusDesc(t, info)}
          </div>
        </NavLink>)
      }
    </>
  )
}

function getVoteStatusDesc(t: TFunction, info: ReturnType<typeof useGovDetailInfo>) {
  let result = <></>
  switch (info.state) {
    case 'Succeeded':
      result = <>
        <div className="flex items-center">
          <CheckCircleTwoTone twoToneColor="#08C849" className="w-3.5 h-3.5 mr-2" />
          <div className="text-xs leading-5 text-dark-gray">
            {t('pass')}: KOGE {t('number')} {info.totalReward} {t('piece')}
          </div>
        </div>
        <div className="flex items-center mt-1 md:ml-2 md:mt-0">
          <ClockCircleFilled className="w-3.5 h-3.5 mr-2 text-dark-gray" />
          <div className="text-xs leading-5 text-dark-gray">
            {t('start_time')}: {moment.unix(info.voteStart).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>
      </>
      break
    case 'Active':
      result = <div className="flex items-center">
        <ClockCircleFilled className="w-3.5 h-3.5 mr-2 text-dark-gray" />
        <div className="text-xs leading-5 text-dark-gray">
          {t('end_time')}: {moment(moment.unix(info.voteEnd).fromNow()).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
      break
    default:
      result = <div className="flex items-center">
        <ClockCircleFilled className="w-3.5 h-3.5 mr-2 text-dark-gray" />
        <div className="text-xs leading-5 text-dark-gray">
          {t('start_time')}: {moment.unix(info.voteStart).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
      break
  }
  return result
}
