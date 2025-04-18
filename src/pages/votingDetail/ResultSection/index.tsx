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
  return <ResultSectionView info={info} />
}

export const ResultSectionView = ({ info }: any) => {
  const { t } = useTranslation()
  const { againstVotes, forVotes, state, quorum, totalStakeAtStart, loading } = info
  const quorumBN = new BigNumber(quorum).div(TEN_POW(4)).times(totalStakeAtStart)
  // console.log(forVotes,againstVotes, 'quorum', quorumBN.div(0.8).div(TEN_POW(18)).toNumber())
  console.log(info, 'info')
  const quorumNormal = new BigNumber(quorumBN).div(TEN_POW(18))
  const totalVotesNeeded = quorumBN.div(0.8).div(TEN_POW(18))

  const totalVotes = new BigNumber(forVotes + againstVotes)
  const isExceedTotal = totalVotes.gt(totalVotesNeeded)
  const stillNeeded = quorumBN.div(TEN_POW(18)).minus(totalVotes)
  const forVotesLevel = 2 / 3
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
      const forPercent = new BigNumber(forVotes).div(totalVotesNeeded).times(100).toNumber()

      const againstPercent = new BigNumber(againstVotes).div(totalVotesNeeded).times(100).toNumber()
      console.log(forPercent, againstPercent)
      return [forPercent, againstPercent]
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
      bg: `repeating-linear-gradient(
        -135deg,
        #DC6803,
        #DC6803 2px,
        #fff 2px,
        #fff 4px)`,
      text: 'still need',
      amount: formatAmount(stillNeeded.isGreaterThan(0) ? stillNeeded : 0, 0),
    },
  ]
  const rightBlock = {
    amount: formatAmount(quorumNormal, 0),
    text: t('quorum_vote'),
  }
  const interimResult = info.forVotes / (info.forVotes + info.againstVotes) >= forVotesLevel
  return (
    <div className="flex-1 flex flex-col mt-20 md:ml-4 md:mt-0">
      <Spin spinning={loading}>
        <Label text={t('vote_result')} />

        {/* <div className="mt-6 flex flex-col flex-1 px-6 pb-8 shadow rounded-lg">
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
          </div> */}
        {/* <div className="flex flex-col mt-8">
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
          </div> */}

        {/* <div className="flex flex-col mt-10">
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
          </div> */}
        <div className="p-6 shadow rounded-lg mt-6 pb-16">
          <div className="flex mt-[10px] justify-between items-start">
            <div>
              <div className="text-[24px] text-[#252B37]">{formatAmount(forVotes + againstVotes, 0)}</div>
              <div className="text-[14px] text-[#717680]">{t('current_vote')}(koge)</div>
              <div className="items-center">
                {threeBlocks.slice(0, 2).map((item, index) => {
                  return (
                    <div key={index} className="flex items-center wrap mr-10 mt-2">
                      <div className="w-[16px] h-[12px] rounded-[2px] mr-2" style={{ background: item.bg }} />
                      <div className="text-[12px]">
                        {item.text}:{item.amount}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <div className="text-[24px] text-[#DC6803]">{rightBlock.amount}</div>
              <div className="text-[14px] text-[#DC6803]">{rightBlock.text}</div>
              {stillNeeded.isGreaterThan(0) && (
                <div className="items-center">
                  {threeBlocks.slice(2, 3).map((item, index) => {
                    return (
                      <div key={index} className="flex items-center wrap mr-10 mt-2">
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
            <div className="flex flex-col items-end">
              <div className="text-[24px] text-[#252B37]" style={{ color: interimResult ? '#08C849' : '#EF2B2B' }}>
                {interimResult ? t('approve_vote') : t('reject_vote')}
              </div>
              <div className="text-[14px] text-[#717680] flex items-center">
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
              className="absolute text-center flex flex-col items-center z-10"
              style={{ left: '80%', transform: 'translateX(-50%)', bottom: '-50px' }}
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
              <div>Goal</div>
            </div>
            <div className="w-full h-6 bg-gray-200 relative rounded-[4px] overflow-hidden">
              <div className="absolute left-0 top-0 h-full flex w-full bg-[#EEF2F6]">
                <div
                  className="h-full absolute z-[0]"
                  style={{
                    width: `${80}%`,
                    background: `repeating-linear-gradient(
                      -135deg,
                      #DC6803,
                      #DC6803 2px,
                      #fff 2px,
                      #fff 4px
                    )`,
                  }}
                />
                <div className="h-full bg-[#08C849] relative" style={{ width: `${forVotesPercent}%` }} />
                <div
                  className="h-full bg-[#EF2B2B] relative"
                  style={{
                    width: `${againstVotesPercent}%`,
                    borderLeft: '2px solid #fff',
                    borderRight: stillNeeded.isGreaterThan(0) ? '2px solid #fff' : '',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  )
}

