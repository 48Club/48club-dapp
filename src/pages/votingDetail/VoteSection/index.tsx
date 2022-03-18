import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import { Button } from 'antd'
import Label from 'components/Label'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useGov from '../../../hooks/gov/useGov'
import { useParams } from 'react-router-dom'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'

export default function VoteSection() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { onVote } = useGov()
  const { myCanVote } = useGovDetailInfo(id)

  return (
    <div className="flex-1 flex flex-col mr-2">
      <Label text="Vote" />
      <div className="mt-6 flex flex-col justify-center px-6 shadow py-2 flex-1">
        <Button
          className="my-4 h-12 text-light-black text-xl font-bold"
          icon={<CheckCircleTwoTone twoToneColor="#08C849" className="align-baseline" />}
          onClick={() => onVote(id, 1)}
          disabled={!myCanVote}
        >
          Approve
        </Button>
        <Button
          className="my-4 h-12 text-light-black text-xl font-bold"
          icon={<CloseCircleTwoTone twoToneColor="#EF2B2B" className="align-baseline" />}
          onClick={() => onVote(id, 0)}
          disabled={!myCanVote}
        >
          Reject
        </Button>
      </div>
    </div>
  )
}
