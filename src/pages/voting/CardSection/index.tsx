import { CheckCircleTwoTone } from '@ant-design/icons'
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
        proposals?.map((item) => <Card item={item} />)
      }
    </Spin>
  )
}

function Card({ item }) {
  const { state, voteEnd } = useGovDetailInfo(item.proposalId)
  return (
    <NavLink to={`/voting/detail/${item.proposalId}`} className="w-full mb-10 flex flex-col p-6 shadow">
      <Tag type={state} />
      <div className="mt-4 text-base leading-6 mb-2 font-medium text-yellow">
        Author: {shorten(item.proposer)}
      </div>
      <div className="font-blod text-xl leading-6 break-words mb-2 text-light-black">
        {item.description.slice(0, 20)}
      </div>
      <div className="break-words text-sm leading-5 mb-12 text-dark-gray">
        {item.description}
      </div>
      <div className="flex flex-row mb-2">
        <CheckCircleTwoTone twoToneColor="#08C849" className="w-3.5 h-3.5 mr-2" />
        <div className="text-xs leading-5 text-dark-gray">
          End time: {moment.unix(voteEnd).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
    </NavLink>
  )
}
