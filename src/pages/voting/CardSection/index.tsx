import { CheckCircleTwoTone, ClockCircleFilled, CloseCircleTwoTone } from '@ant-design/icons'
import Tag from 'components/Tag'
import { NavLink } from 'react-router-dom'
import { useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatAmount, shorten } from '@funcblock/dapp-sdk'
import { useEthers } from '@usedapp/core'
import moment from 'moment'
import { Spin } from 'antd'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import useGovInfo from '../../../hooks/gov/useGovInfo'
import { GovInfoFilterContext } from '../../../hooks/gov/useGov'
import { TFunction } from 'i18next'
import { ResultSectionView } from '../../votingDetail/ResultSection'
import { VoteSectionView } from '../../votingDetail/VoteSection'

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

function Card({ item }: { item: any }) {
  const { t } = useTranslation()
  const info = useGovDetailInfo(item.proposalId)
  const { state, voteStart, proposer } = info
  const { status, related, claimable, timeRanges, voted } = useContext(GovInfoFilterContext)
  const { account } = useEthers()
  const [showPanel, setShowPanel] = useState(false)
  const show = useMemo(() => {
    const statusShow = status === 'all' || status === state
    const timeShow = !timeRanges.length || (moment.unix(voteStart).isAfter(timeRanges?.[0]) && moment.unix(voteStart).isBefore(timeRanges?.[1]))
    const releatedShow = !related || account === proposer
    const claimableShow = !claimable || item.claimable
    const hasVoted = info.myVotes?.gt(0)
    let votedShow = true
    if (voted) {
      votedShow = hasVoted === voted
    }
    
    return statusShow && timeShow && releatedShow && claimableShow && votedShow
  }, [status, state, timeRanges, voteStart, related, account, proposer, claimable, item, info.myVotes])

  const ntitle = (item?.ntitle) === '' ? item?.description : (item?.ntitle)
  const handleVotePanel = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const handleShowPanel = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    setShowPanel(flag => !flag)
  }
  return (
    <NavLink to={`/voting/detail/${item.proposalId}`} className={`w-full mb-10 flex flex-col p-6 md:p-10 shadow rounded-lg ${show ? 'block' : 'hidden'}`}>
      <div className="flex flex-col md:flex-row-reverse md:mb-2">
        <Tag type={state} className="min-w-16 h-7" />
        <div className="mb-2 mt-2 text-base leading-6 font-medium text-light-black">#{item.proposalId}</div>
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
      <div className='flex justify-end -mt-[27px] items-center'>
        {info.myVotes?.gt(0) && (<><div className="text-xs leading-5 text-dark-gray mr-[5px]">
          {t('vote_result')}:
        </div>
          <div className="text-xs leading-5 text-dark-gray">{info.myVoteType === 1 ? t('approve_vote') : t('reject_vote')}</div></>)
        }
        <div
          onClick={handleShowPanel}
          className="transition-transform duration-300 flex justify-end "
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${!showPanel ? "rotate-180" : "rotate-0"
              }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>
      {/* { info.myVotes?.gt(0) && (<div>{info.myVoteType === 1 ? 'Approve' : 'Reject'}</div>) } */}
      {showPanel && (<div className="flex flex-col md:flex-row items-stretch mt-[10px]" onClick={handleVotePanel}>
        <VoteSectionView info={info} proposalId={item.proposalId} notInitRecords={true} />
        <ResultSectionView info={info} />
      </div>)}

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
        <div className="flex items-center mt-1 md:ml-2 md:mt-0">
          <ClockCircleFilled className="w-3.5 h-3.5 mr-1 text-dark-gray" />
          <div className="text-xs leading-5 text-dark-gray">
            {t('start_time')}: {moment.unix(info.voteStart).fromNow()}
          </div>
        </div>
      </>
    case 'Active':
      let CardSectioNode = <>
        <CloseCircleTwoTone twoToneColor='#0849C8' className="w-3.5 h-3.5 mr-1" /><div className="text-xs leading-5 text-dark-gray">
          Not Voted
        </div>
      </>
      if (info.myVotes?.gt(0)) {
        CardSectioNode = <> <CheckCircleTwoTone twoToneColor='#08C849' className="w-3.5 h-3.5 mr-1" />
          <div className="text-xs leading-5 text-dark-gray">
            Voted
          </div>
        </>
      }
      return <div className="flex items-center">
        <div className="flex items-center">
          {CardSectioNode}
        </div>
        <div className="flex items-center">
          <ClockCircleFilled className="w-3.5 h-3.5 mr-1 text-dark-gray" />
          <div className="text-xs leading-5 text-dark-gray">
            {t('end_time')}: {moment.unix(info.voteEnd).fromNow()}
          </div>
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
