import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import { Button } from 'antd'
import Label from 'components/Label'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useGov from '../../../hooks/gov/useGov'
import { useParams } from 'react-router-dom'

export default function VoteSection() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { onVote } = useGov()

  return (
    <div className="pt-20 w-full">
      <Label text="Vote" />
      <div className="mt-6 flex flex-col px-6 shadow py-2">
        <Button
          className="my-4 h-12 text-light-black text-xl font-bold"
          icon={<CheckCircleTwoTone twoToneColor="#08C849" className="align-baseline" />}
          onClick={() => onVote(id, 1)}
        >
          Approve
        </Button>
        <Button
          className="my-4 h-12 text-light-black text-xl font-bold"
          icon={<CloseCircleTwoTone twoToneColor="#EF2B2B" className="align-baseline" />}
          onClick={() => onVote(id, 0)}
        >
          Reject
        </Button>
      </div>
    </div>
  )
}
