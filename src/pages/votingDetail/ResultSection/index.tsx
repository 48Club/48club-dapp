import { useMemo } from 'react'
import {
  CheckCircleFilled,
  CaretDownOutlined,
  FrownFilled,
  QuestionCircleOutlined,
  CaretUpOutlined,
} from '@ant-design/icons'
import { Button, Popover } from 'antd'
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
  return <ResultSectionView info={info} id={id} />
}

export const ResultSectionView = ({ info, id }: any) => {
  const { t } = useTranslation()
  const { againstVotes, forVotes, abstainVotes, state, quorum, totalStakeAtStart, loading, forVotesThresholdBps } = info
  const quorumBN = new BigNumber(quorum).div(TEN_POW(4)).times(totalStakeAtStart)
  const quorumNormal = new BigNumber(quorumBN).div(TEN_POW(18))
  const totalVotesNeeded = quorumBN.div(1).div(TEN_POW(18))

  const totalVotes = new BigNumber(forVotes + againstVotes + abstainVotes)
  const isExceedTotal = totalVotes.gt(totalVotesNeeded)
  const stillNeeded = quorumBN.div(TEN_POW(18)).minus(totalVotes)
  const forVotesLevel = forVotesThresholdBps
  const [forVotesPercent, againstVotesPercent, abstainVotesPercent] = useMemo(() => {
    if (totalVotes.eq(0)) {
      return [0, 0, 0]
    }
    if (isExceedTotal && !['Invalid', 'Refunded', 'Defeated', 'Succeeded'].includes(state)) {
      // 如果总票数超过了需求，计算相对比例然后分配98%
      const forRatio = new BigNumber(forVotes).div(totalVotes)
      const againstRatio = new BigNumber(againstVotes).div(totalVotes)
      const abstainRatio = new BigNumber(abstainVotes).div(totalVotes)
      console.log(forRatio.toNumber(), againstRatio.toNumber())
      // 按照投票比例分配98%
      const forPercent = forRatio.times(98).toNumber()
      const againstPercent = againstRatio.times(98).toNumber()
      const abstainPercent = abstainRatio.times(98).toNumber()

      return [forPercent, againstPercent, abstainPercent]
    } else {
      // 如果没超过，直接计算相对于totalVotesNeeded的比例
      const totalVotesNeeded = quorumBN.div(1).div(TEN_POW(18))
      const forPercent = new BigNumber(forVotes).div(totalVotesNeeded).times(100).toNumber()

      const againstPercent = new BigNumber(againstVotes).div(totalVotesNeeded).times(100).toNumber()
      const abstainPercent = new BigNumber(abstainVotes).div(totalVotesNeeded).times(100).toNumber()
      console.log(forPercent, againstPercent, abstainPercent)
      return [forPercent, againstPercent, abstainPercent]
    }
  }, [forVotes, againstVotes, totalVotesNeeded])
  const threeBlocks = [
    {
      bg: '#08C849',
      text: t('approve_vote'),
      amount: formatAmount(forVotes, 0),
    },
    {
      bg: '#EF2B2B',
      text: t('reject_vote'),
      amount: formatAmount(againstVotes, 0),
    },
    {
      bg: '#A9A29D',
      text: t('abstain_vote'),
      amount: formatAmount(abstainVotes, 0),
    },
  ]
  const stillNeededBlocks = [
    {
      bg: `repeating-linear-gradient(
        -135deg,
        #DC6803,
        #DC6803 2px,
        #fff 2px,
        #fff 4px)`,
      text: t('still_needed'),
      amount: formatAmount(stillNeeded.isGreaterThan(0) ? stillNeeded : 0, 0),
    }
  ]
  const rightBlock = {
    amount: formatAmount(quorumNormal, 0),
    text: t('quorum_vote'),
  }
  const interimResult = info.forVotes / (info.forVotes + info.againstVotes + info.abstainVotes) >= forVotesLevel
  return (
    <div className="flex-1 flex flex-col mt-20 md:ml-4 md:mt-0">
      <Spin spinning={loading}>
        <Label text={t('vote_result')} />
        <div className="p-6 shadow rounded-lg mt-6 pb-16">
          <div className="flex mt-[10px] justify-between items-start flex-wrap <md:flex-col <md:w-full">
            <div className="<md:mb-4">
              <div className="text-[24px] text-[#252B37]">{formatAmount(forVotes + againstVotes, 0)}</div>
              <div className="text-[12px] text-[#717680]">{t('current_vote')}(KOGE)</div>
              <div className="items-center">
                {(id <= 165 ? threeBlocks.slice(0, 2) : threeBlocks).map((item, index) => {
                  return (
                    <div key={index} className="flex items-center wrap mt-2">
                      <div className="w-[16px] h-[12px] rounded-[2px] mr-2" style={{ background: item.bg }} />
                      <div className="text-[12px]">
                        {item.text}:{item.amount}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="<md:mb-4">
              <div className="text-[24px] text-[#DC6803]">{rightBlock.amount}</div>
              <div className="text-[12px] text-[#DC6803]">{rightBlock.text}</div>
              {stillNeeded.isGreaterThan(0) && (
                <div className="items-center">
                  {stillNeededBlocks.map((item, index) => {
                    return (
                      <div key={index} className="flex items-center wrap mt-2">
                        <div className="w-[16px] h-[12px] rounded-[2px] mr-2" style={{ background: item.bg }} />
                        <div className="text-[12px]">
                          {item.text}:{item.amount}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end <md:w-full <md:items-start">
              <div className="text-[24px] text-[#252B37]" style={{ color: ['Invalid', 'Refunded', 'Defeated', 'Succeeded'].includes(state)? interimResult ? '#08C849' : '#EF2B2B' : 'gray' }}>
                {interimResult ? t('approve_vote') : t('reject_vote')}
              </div>
              <div className="text-[12px] text-[#717680] flex items-center">
                {t('interim_result')}
                <Popover
                  content={
                    <div className="w-[250px] break-all">
                      {interimResult ? (
                        <div>{t('interim_result_for', { forVotesLevel: `${(forVotesLevel * 100).toFixed(2)}%` })}</div>
                      ) : (
                        <div>
                          {t('interim_result_against', { forVotesLevel: `${(forVotesLevel * 100).toFixed(2)}%` })}
                        </div>
                      )}
                    </div>
                  }
                >
                  <div className="flex justify-end items-center">
                    <QuestionCircleOutlined style={{ fontSize: '12px', marginLeft: '5px', color: '#d0d0d0' }} />
                  </div>
                </Popover>
              </div>
            </div>
          </div>

          <div className="relative mt-8 text-[12px]">
            <div
              className="absolute text-center flex flex-col items-center z-10 min-w-[40px]"
              style={{ left: isExceedTotal ? '80%' : '100%', transform: 'translateX(-50%)', bottom: '-50px' }}
            >
              <div
                className="h-[10px] bg-black mt-2"
                style={{
                  width: '1px',
                  borderRight: '1px dotted',
                  height: '50px',
                }}
              />
              <CaretUpOutlined style={{ fontSize: '10px' }} />
              <div>{t('goal')}</div>
            </div>
            <div className="w-full h-6 bg-gray-200 relative rounded-[4px] overflow-hidden">
              <div className="absolute left-0 top-0 h-full flex w-full bg-[#EEF2F6]">
                <div
                  className="h-full absolute z-[0]"
                  style={{
                    width: `${isExceedTotal ? 80 : 100}%`,
                    background: `repeating-linear-gradient(
                      -135deg,
                      #DC6803,
                      #DC6803 2px,
                      #fff 2px,
                      #fff 4px
                    )`,
                  }}
                />
                <div className={`flex flex-row ${interimResult ? 'flex-row-reverse' : ''}` } style={{ width: `${Math.max(againstVotesPercent + forVotesPercent, 1)}%` }}>
                {
                  forVotesPercent > 0 && (<div className="h-full bg-[#08C849] relative" style={{ width: `${forVotesPercent}%`, borderRight: stillNeeded.isGreaterThan(0) && !interimResult ? ' 1px solid #fff' : '', }} />)
                }
                {
                  againstVotesPercent > 0 && (<div
                    className="h-full bg-[#EF2B2B] relative"
                    style={{
                      width: `${Math.max(againstVotesPercent, 1)}%`,
                      borderRight: stillNeeded.isGreaterThan(0) && interimResult ? '1px solid #fff' : '',
                    }}
                  />)
                }
                </div>
                {
                  abstainVotesPercent > 0 && (
                    <div
                      className="h-full bg-[#A9A29D] relative"
                      style={{
                        width: `${Math.max(abstainVotesPercent, 1)}%`,
                        borderLeft: '2px solid #fff',
                        borderRight: stillNeeded.isGreaterThan(0) ? '1px solid #fff' : '',
                      }}
                    />
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  )
}

