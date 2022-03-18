import { CheckCircleTwoTone } from '@ant-design/icons'
import Tag from 'components/Tag'
import { NavLink } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGovernanceContractReadonly } from '../../../hooks/useContract'
import { shorten } from '@funcblock/dapp-sdk'
import moment from 'moment'
import { Spin } from 'antd'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'

export default function CardSection() {
  const { t } = useTranslation()

  const [records, setRecords] = useState<any[] | undefined>(undefined)
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
      console.log(rows)
      setRecords(rows)
    })()
  }, [govContractReadonly])

  return (
    <Spin spinning={!records} className="pt-4 w-full mb-20">
      {
        records?.map((item) => <Card item={item} />)
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
