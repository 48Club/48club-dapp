import { CheckCircleTwoTone, CloseCircleTwoTone, MinusCircleTwoTone, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Button, Input, Spin, Tooltip } from 'antd'
import Label from 'components/Label'
import { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useGov from '../../../hooks/gov/useGov'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import { formatAmount } from '@funcblock/dapp-sdk'
import { HelpCircle } from 'react-feather'
import { useEthers } from '@usedapp/core'
import useStakeInfo from '../../../hooks/staking/useStakeInfo'
import useGovDetailVotes from '../../../hooks/gov/useGovDetailVotes'
import useGovDetailClaims from '../../../hooks/gov/useGovDetailClaims'

interface props {
  proposalId: string
  notInitRecords?: boolean
}
export default function VoteSection({ proposalId, notInitRecords }: props) {
  const info = useGovDetailInfo(proposalId as string)

  return (
    <VoteSectionView info={info} proposalId={proposalId} notInitRecords={notInitRecords} />
  )
}

export function VoteSectionView({ info, proposalId, notInitRecords }: any) {
  const { t } = useTranslation()
  const id = proposalId
  const { myCanVote, state, myReward, myVotes, myVoteType } = info
  const { myStakeBalance } = useStakeInfo()
  const { voteRecords, reloadVoteRecords } = useGovDetailVotes(id as string, notInitRecords)
  const { claimRecords, reloadClaimRecords } = useGovDetailClaims(id as string)
  function getPanel() {
    if (state === 'Defeated' || state === 'Succeeded') {
      return <ClaimRewardPanel id={id} myReward={myReward}
        claimRecords={claimRecords} reloadClaimRecords={reloadClaimRecords} />
    }
    if (state === 'Refunded') {
      return <RefundPanel id={id} state={state} myVotes={myVotes}  />
    }
    if (state === 'Invalid') {
      return <InvalidPanel id={id} state={state} />
    }
    return <ActionPanel id={id} canVote={myCanVote && myStakeBalance?.gt(0)}
      voteRecords={voteRecords} reloadVoteRecords={reloadVoteRecords} myVotes={myVotes} myVoteType={myVoteType} />
  }

  return (
    <div className="flex-1 flex flex-col md:mr-4">
      <Label text={t('vote')} />
      <div className="mt-6 flex flex-col justify-center p-10 flex-1 rounded-lg shadow">
        {getPanel()}
      </div>
    </div>
  )
}

function ActionPanel({ id, canVote, voteRecords, reloadVoteRecords, myVotes, myVoteType }: any) {
  const { onVote } = useGov()
  // const { account } = useEthers()
  const { myStakeBalance } = useStakeInfo()
  const { t } = useTranslation()

  const [reason, setReason] = useState("")

  // const myVoted = voteRecords?.find((i: any) => i.voter === account && i.proposalId === id)
  const myVoted = myVotes?.gt(0)
  const onSubmit = useCallback(async (id: any, support: any, reason: any) => {
    await onVote(id, support, reason)
    setTimeout(reloadVoteRecords, 1000)
  }, [onVote, reloadVoteRecords])

  const myVotesBN = myVotes?.gt(0) ? myVotes : myStakeBalance
  const votedView = useMemo(() => {
    return (<div className='flex items-center flex-col'>
      <div className='mb-[20px]'>
        {
          myVoteType === 1 && (<CheckCircleFilled className={`mr-2.5 text-green text-base`} style={{ fontSize: '50px' }} />)
        }
        { myVoteType === 0 && (<CloseCircleFilled className="mr-2.5 text-red text-base" style={{ fontSize: '50px' }} />) }
        
      </div>
      <div className='mb-[20px]'>My {myVotes ? 'votes' : 'staking'}: {formatAmount(myVotesBN, 18)} KOGE</div>
      <div>请等待</div>
    </div>)
  }, [myVoted, myVoteType])
  const notVotedView = useMemo(() => {
    return (<><div className="mb-2 text-center text-dark-gray">My {myVotes ? 'votes' : 'staking'}: {formatAmount(myVotesBN, 18)} KOGE</div>

    <Input
      placeholder={t("placeholder_reason")}
      className="h-12 rounded font-medium text-sm text-light-black"
      value={reason}
      onChange={(e) => setReason(e.target.value)}
    />
    <Button
      className={`bg-white mt-6 h-12 text-light-black text-xl font-bold`}
      icon={<CheckCircleTwoTone twoToneColor="#08C849" className="align-baseline" />}
      onClick={() => !myVoted && onSubmit(id, 1, reason)}
      disabled={!canVote || myVoted}
    >
      {t('approve_vote')}
    </Button>
    <Button
      className={`bg-white mt-6 h-12 text-light-black text-xl font-bold`}
      icon={<CloseCircleTwoTone twoToneColor="#EF2B2B" className="align-baseline" />}
      onClick={() => !myVoted && onSubmit(id, 0, reason)}
      disabled={!canVote || myVoted}
    >
      {t('reject_vote')}
    </Button>

  </>)
  }, [myVotes, myVotesBN])
  return <Spin spinning={!canVote}>
    <div className="flex flex-col justify-center items-stretch">
      {myVoted ? votedView : notVotedView}
    </div>
  </Spin>
}


function ClaimRewardPanel({ id, myReward, claimRecords, reloadClaimRecords }: any) {
  const { onClaim } = useGov()
  const { t } = useTranslation()
  const { account } = useEthers()
  const myClaim = claimRecords?.find((i: any) => i.caller === account)

  const onSubmit = useCallback(async () => {
    await onClaim(id)
    setTimeout(reloadClaimRecords, 1000)
  }, [onClaim, id, reloadClaimRecords])

  return <div className="flex flex-col items-center">
    <CheckCircleTwoTone className="md:pb-7" style={{ fontSize: '52px' }} twoToneColor="#08C849" />
    <div className="mb-4 text-lg font-bold">{t('vote_success_desc')}</div>
    {
      myReward.gt(0) && (
        <Button
          className="my-4 h-12 md:h-10 bg-primary text-black border-none rounded text-sm"
          onClick={onSubmit}
        >
          {t('claim')} {formatAmount(myReward, 18)} KOGE
        </Button>
      )
    }
    {
      myClaim && (
        <div>{formatAmount(myClaim.amount, 18)} KOGE {t('claimed')}</div>
      )
    }
  </div>
}


function InvalidPanel({ id, state }: any) {
  const { onRefund } = useGov()
  const { t } = useTranslation()

  return <div className="flex flex-col justify-center items-center">
    <MinusCircleTwoTone className="md:pb-7" style={{ fontSize: '52px' }} twoToneColor="#A9A9A9" />
    <div className="mb-4 text-lg font-bold">The proposal is invalid</div>
    {
      state === 'Invalid' && (
        <Button
          className="my-4 h-12 md:h-10 bg-primary text-black flex flex-row items-center border-none rounded text-sm"
          onClick={() => onRefund(id)}
        >
          <div className="mr-1">{t('close')}</div>
          <Tooltip className="opacity-50" placement="top"
            title="Closing invalid proposal will be rewarded">
            <HelpCircle size={16} />
          </Tooltip>
        </Button>
      )
    }
  </div>
}
function RefundPanel({ id, state, myVotes }: any) {
  const { onRefund } = useGov()
  const { t } = useTranslation()
  const myVotesBN = myVotes
  const isMyVoted = myVotes.gt(0)
  console.log(isMyVoted, 'isMyVoted')
  const votedView = useMemo(() => {
    return (<div className='flex items-center flex-col'>
      <MinusCircleTwoTone className="md:pb-7" style={{ fontSize: '52px' }} twoToneColor="#A9A9A9" />
      <div className='mb-[20px]'>
        投票：{formatAmount(myVotesBN, 18)} KOGE
      </div>
      <div>该投票无效，未达到有效票数</div>
    </div>)
  }, [myVotesBN])
  const notVotedView = useMemo(() => {
    return (<><MinusCircleTwoTone className="md:pb-7" style={{ fontSize: '52px' }} twoToneColor="#A9A9A9" />
    <div className="mb-4 text-lg font-bold">The proposal is invalid</div></>)
  }, [])
  return <div className="flex flex-col justify-center items-center">
    {isMyVoted ? votedView : notVotedView}
  </div>
}


