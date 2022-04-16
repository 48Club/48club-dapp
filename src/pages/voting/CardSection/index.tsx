import { CheckCircleTwoTone, ClockCircleFilled, CloseCircleTwoTone } from '@ant-design/icons'
import Tag from 'components/Tag'
import { NavLink } from 'react-router-dom'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { formatAmount, shorten } from '@funcblock/dapp-sdk'
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
  const { state, voteStart, proposer } = info
  const { status, related, timeRanges } = useContext(GovInfoFilterContext)
  const { account } = useEthers()

  const show = useMemo(() => {
    const statusShow = status === 'all' || status === state
    const timeShow = !timeRanges.length || (moment.unix(voteStart).isAfter(timeRanges?.[0]) && moment.unix(voteStart).isBefore(timeRanges?.[1]))
    const releatedShow = !related || account === proposer

    return statusShow && timeShow && releatedShow
  }, [status, state, timeRanges, voteStart, related, account, proposer])

  const ntitle = (item?.ntitle) === '' ? item?.description : (item?.ntitle)

  return (
    <NavLink to={`/voting/detail/${item.proposalId}`} className={`w-full mb-10 flex flex-col p-6 md:p-10 shadow rounded-lg ${show ? 'block' : 'hidden'}`}>
      <div className="flex flex-col md:flex-row-reverse md:mb-2">
        <Tag type={state} className="min-w-16 h-7" />
        <div className="mb-2 mt-4 text-base leading-6 font-medium text-yellow md:flex-1 md:mt-0 md:mb-0">
          {t('author')}: {shorten(item.proposer)}
        </div>
      </div>
      <div className="font-bold text-xl leading-6 break-words mb-2 text-light-black overflow-hidden" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {ntitle}
      </div>
      <div className="break-words text-sm leading-5 mb-12 md:mb-9 text-dark-gray">
        {item.description.slice(0, 200)}
      </div>
      <div className="mb-2 flex flex-col md:flex-row md:items-center">
        {
          getVoteStatusDesc(t, info)
        }
      </div>
    </NavLink>
  )
}

function getVoteStatusDesc(t: TFunction, info: ReturnType<typeof useGovDetailInfo>) {
  switch (info.state) {
    case 'Succeeded':
      return <>
        <div className="flex items-center">
          <CheckCircleTwoTone twoToneColor="#08C849" className="w-3.5 h-3.5 mr-1" />
          <div className="text-xs leading-5 text-dark-gray">
            KOGE {t('number')} {formatAmount(info.totalReward, 18)} {t('piece')}
          </div>
        </div>
        <div className="flex items-center mt-1 md:ml-1 md:mt-0">
          <ClockCircleFilled className="w-3.5 h-3.5 mr-2 text-dark-gray" />
          <div className="text-xs leading-5 text-dark-gray">
            {t('start_time')}: {moment.unix(info.voteStart).fromNow()}
          </div>
        </div>
      </>
    case 'Active':
      return <div className="flex items-center">
        <ClockCircleFilled className="w-3.5 h-3.5 mr-1 text-dark-gray" />
        <div className="text-xs leading-5 text-dark-gray">
          {t('end_time')}: {moment.unix(info.voteEnd).fromNow()}
        </div>
      </div>
    default:
      return <div className="flex items-center">
        <div className="flex items-center">
          <CloseCircleTwoTone twoToneColor="#C82853" className="w-3.5 h-3.5 mr-1" />
          <div className="text-xs leading-5 text-dark-gray">
            KOGE {t('number')} {formatAmount(info.totalReward, 18)} {t('piece')}
          </div>
        </div>
        <div className="flex items-center mt-1 md:ml-2 md:mt-0">
          <ClockCircleFilled className="w-3.5 h-3.5 mr-1 text-dark-gray" />
          <div className="text-xs leading-5 text-dark-gray">
            {t('start_time')}: {moment.unix(info.voteStart).fromNow()}
          </div>
        </div>
      </div>
  }
}
