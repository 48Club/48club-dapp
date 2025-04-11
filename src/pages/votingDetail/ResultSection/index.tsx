import { useMemo } from 'react'
import { CheckCircleFilled, CloseCircleFilled, FrownFilled, SmileFilled } from '@ant-design/icons'
import Label from 'components/Label'
import { useTranslation } from 'react-i18next'
import useGovDetailInfo from '../../../hooks/gov/useGovDetailInfo'
import { useParams } from 'react-router-dom'
import { formatAmount, TEN_POW } from '@funcblock/dapp-sdk'
import BigNumber from 'bignumber.js'
import { Spin } from 'antd'

export default function ResultSection() {
  const { id } = useParams<{ id: string }>()
  const info = useGovDetailInfo(id as string)
  return <ResultSectionView info ={info} />
}

export const ResultSectionView = ({ info }: any) => {
  const { t } = useTranslation()
  const { againstVotes, forVotes, state, quorum, totalStakeAtStart, loading } = info
  const quorumBN = new BigNumber(quorum).div(TEN_POW(4)).times(totalStakeAtStart)
  console.log(forVotes,againstVotes, 'quorum', quorumBN.div(0.8).div(TEN_POW(18)).toNumber())
  const quorumNormal = new BigNumber(quorumBN).div(TEN_POW(18))
  const totalVotesNeeded = quorumBN.div(0.8).div(TEN_POW(18))
  
  const totalVotes = new BigNumber(forVotes + againstVotes)
  const isExceedTotal = totalVotes.gt(totalVotesNeeded)

  const [forVotesPercent, againstVotesPercent] = useMemo(() => {
    if (totalVotes.eq(0)) {
      return [0, 0]
    }
    
    if (isExceedTotal) {
      // 如果总票数超过了需求，计算相对比例然后分配98%
      const forRatio = new BigNumber(forVotes).div(totalVotes)
      const againstRatio = new BigNumber(againstVotes).div(totalVotes)
      console.log(forRatio.toNumber(), againstRatio.toNumber())
      // 按照投票比例分配98%
      const forPercent = forRatio.times(98).toNumber()
      const againstPercent = againstRatio.times(98).toNumber()

      return [forPercent, againstPercent]
    } else {
      // 如果没超过，直接计算相对于totalVotesNeeded的比例
      const forPercent = new BigNumber(forVotes)
        .div(totalVotesNeeded)
        .times(100)
        .toNumber()
      
      const againstPercent = new BigNumber(againstVotes)
        .div(totalVotesNeeded)
        .times(100)
        .toNumber()
      console.log(forPercent, againstPercent)
      return [forPercent, againstPercent]
    }
  }, [forVotes, againstVotes, totalVotesNeeded])
  return (
    <div className="flex-1 flex flex-col mt-20 md:ml-4 md:mt-0">
      <Spin spinning={loading}>
        <Label text={t('vote_result')} />

        <div className="mt-6 flex flex-col flex-1 px-6 pb-8 shadow rounded-lg">
          <div className="flex flex-row items-center mt-6 pb-4 border-b border-gray">
            {state === 'Active' && <SmileFilled className="text-base text-gray mr-2.5" />}
            {state === 'Succeeded' && <SmileFilled className="text-base text-gray mr-2.5" />}
            {state === 'Defeated' && <FrownFilled className="text-base text-gray mr-2.5" />}
            {state === 'Invalid' && <FrownFilled className="text-base text-gray mr-2.5" />}
            {state === 'Refunded' && <FrownFilled className="text-base text-gray mr-2.5" />}
            <span className="text-sm text-dark-gray">
              {
                t(state?.toLowerCase())}. {(state === 'Invalid' || state === 'Refunded') ?
                  <span>{t('result_tip1')}{formatAmount(quorumBN, 18)} KOGE</span> :
                  <span>{t('result_tip2')}{formatAmount(forVotes + againstVotes, 0)} KOGE. Quorum: {formatAmount(quorumBN, 18)} KOGE</span>
              }
            </span>
          </div>
          <div className="flex flex-col mt-8">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row">
                <CheckCircleFilled className="mr-2.5 text-green text-base" />
                <span className="text-black text-sm leading-6">{t('approve_vote')}</span>
              </div>
              <span className="text-black text-sm">{formatAmount(forVotes, 0)} KOGE</span>
            </div>
            <div className="mt-2.5 w-full relative">
              <div className="h-6 rounded-xl bg-green opacity-10">&nbsp;</div>
              <div className="px-1 absolute left-0 top-1 w-full">
                <div className=" bg-green h-4 rounded-xl" style={{ width: `${100 * forVotes / (forVotes + againstVotes)}%`, borderRadius: '0.75rem' }}>&nbsp;</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-10">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row">
                <CloseCircleFilled className="mr-2.5 text-red text-base" />
                <span className="text-black text-sm leading-6">{t('reject_vote')}</span>
              </div>
              <span className="text-black text-sm">{formatAmount(againstVotes, 0)} KOGE</span>
            </div>
            <div className="mt-2.5 w-full relative">
              <div className="h-6 rounded-xl bg-red opacity-10">&nbsp;</div>
              <div className="px-1 absolute left-0 top-1 w-full">
                <div className=" bg-red h-4 rounded-xl" style={{ width: `${100 * againstVotes / (forVotes + againstVotes)}%`, borderRadius: '0.75rem' }}>&nbsp;</div>
              </div>
            </div>
          </div>
          <div 
            className="h-[10px] bg-black mt-2"
            style={{ 
              width: `${againstVotesPercent + forVotesPercent}%`,
              borderTop: '1px solid black',
              borderLeft: '1px solid black',
              borderRight: '1px solid black',
            }}
          />
          <div className="w-full h-6 bg-gray-200 relative">
            <div className="absolute left-0 top-0 h-full flex w-full bg-[#EEF2F6]">
              <div 
                className="h-full bg-[#FF5900] absolute z-[-1]" 
                style={{ width: `${80}%` }} 
              />
              <div 
                className="h-full bg-[#ef2b2b]" 
                style={{ width: `${againstVotesPercent}%` }} 
              />
              <div 
                className="h-full bg-[#08c849]" 
                style={{ width: `${forVotesPercent}%` }} 
              />
            </div>
          </div>
        </div>
      </Spin>
    </div>
  )
}

