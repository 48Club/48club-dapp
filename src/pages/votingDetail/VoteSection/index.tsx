import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import Label from 'components/Label'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useGov from '../../../hooks/gov/useGov'
import { useParams } from 'react-router-dom'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import { formatAmount } from '@funcblock/dapp-sdk'
import { HelpCircle } from 'react-feather'

export default function VoteSection() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { myCanVote, state, myReward } = useGovDetailInfo(id)

  function getPanel() {
    if (state === 'Defeated' || state === 'Succeeded') {
      return <ClaimRewardPanel id={id} myReward={myReward} />
    }
    if (state === 'Invalid' || state === 'Refunded') {
      return <InvalidPanel id={id} state={state} />
    }
    return <ActionPanel id={id} myCanVote={myCanVote} />
  }

  return (
    <div className="flex-1 flex flex-col mr-2">
      <Label text="Vote" />
      <div className="mt-6 flex flex-col justify-center px-6 shadow py-2 flex-1">
        {getPanel()}
      </div>
    </div>
  )
}

function ActionPanel({ id, myCanVote }) {
  const { onVote } = useGov()
  return <>
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
  </>
}


function ClaimRewardPanel({ id, myReward }) {
  const { onClaim } = useGov()
  return <div className="flex flex-col items-center">
    <div className="mb-4  text-lg">The proposal is valid. Please claim your reward</div>
    <Button
      className="my-4 h-12 bg-primary text-black"
      onClick={() => onClaim(id)}
      disabled={!myReward.gt(0)}
    >
      Claim {formatAmount(myReward, 18)} KOGE
    </Button>
  </div>
}


function InvalidPanel({ id, state }) {
  const { onRefund } = useGov()
  return <div className="flex flex-col items-center">
    <div className="mb-4  text-lg">The proposal is invalid</div>

    {
      state === 'Invalid' && (
        <Button
          className="my-4 h-12 bg-primary text-black flex flex-row items-center"
          onClick={() => onRefund(id)}
        >
          <div className="mr-1">Close</div>
          <Tooltip className="opacity-50" placement="top"
                   title="Closing invalid proposal will be rewarded">
            <HelpCircle size={16} />
          </Tooltip>
        </Button>
      )
    }
  </div>
}


