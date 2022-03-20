import { CheckCircleTwoTone, ClockCircleFilled } from '@ant-design/icons'
import Tag from 'components/Tag'
import { NavLink } from 'react-router-dom'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { shorten } from '@funcblock/dapp-sdk'
import moment from 'moment'
import { Spin } from 'antd'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import useGovInfo from '../../../hooks/gov/useGovInfo'

export default function CardSection() {
  const { t } = useTranslation()
  const { proposals } = useGovInfo()

  return (
    <Spin spinning={!proposals} className="pt-4 w-full mb-20">
      {
        proposals?.map((item, index) => <Card item={item} key={index}/>)
      }
    </Spin>
  )
}

function Card({ item }) {
  const info = useGovDetailInfo(item.proposalId)
  const { state, voteEnd, voteStart, totalReward } = info

  return (
    <NavLink to={`/voting/detail/${item.proposalId}`} className="w-full mb-10 flex flex-col p-6 md:p-10 shadow rounded-lg">
      <div className="flex flex-col md:flex-row-reverse md:mb-2">
        <Tag type={state} className="min-w-16 h-7" />
        <div className="mb-2 mt-4 text-base leading-6 font-medium text-yellow md:flex-1 md:mt-0 md:mb-0">
          Author: {shorten(item.proposer)}
        </div>
      </div>
      <div className="font-blod text-xl leading-6 break-words mb-2 text-light-black">
        {item.description.slice(0, 20)}
      </div>
      <div className="break-words text-sm leading-5 mb-12 md:mb-9 text-dark-gray">
        {item.description}
      </div>
      <div className="mb-2 flex flex-col md:flex-row md:items-center">
        {
          voteStatusDesc(info)
        }
      </div>
    </NavLink>
  )
}

function voteStatusDesc(info: ReturnType<typeof useGovDetailInfo>) {
  let result = <></>
  switch (info.state) {
    case 'Succeeded':
      result = <>
          <div className="flex items-center">
            <CheckCircleTwoTone twoToneColor="#08C849" className="w-3.5 h-3.5 mr-2" />
            <div className="text-xs leading-5 text-dark-gray">
              已通过: KOGE回收数量为{info.totalReward}枚
            </div>
          </div>
          <div className="flex items-center mt-1 md:ml-2 md:mt-0">
            <ClockCircleFilled className="w-3.5 h-3.5 mr-2 text-dark-gray"/>
            <div className="text-xs leading-5 text-dark-gray">
              提出时间: {moment.unix(info.voteStart).format('YYYY-MM-DD HH:mm')}
            </div>
          </div>
        </>
      break;
    case 'Active':
      result = <div className="flex items-center">
        <ClockCircleFilled className="w-3.5 h-3.5 mr-2 text-dark-gray"/>
        <div className="text-xs leading-5 text-dark-gray">
          距离结束还有: {moment(moment.unix(info.voteEnd).fromNow()).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
      break;
    default:
      result = <div className="flex items-center">
        <ClockCircleFilled className="w-3.5 h-3.5 mr-2 text-dark-gray"/>
        <div className="text-xs leading-5 text-dark-gray">
          提出时间: {moment.unix(info.voteStart).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
      break;
  }
  return result
}
