import Back from 'components/Back'
import React from 'react'
import HeaderSection from './HeaderSection'
import ResultSection from './ResultSection'
import VoteSection from './VoteSection'
import HistorySection from './HistorySection'

export default function VotingDetail() {
  return (
    <div className="relative px-4 max-w-6xl mx-auto pb-20">
      <Back />
      <HeaderSection />
      <div className="flex flex-col md:flex-row items-stretch mt-20">
        <VoteSection />
        <ResultSection />
      </div>
      <HistorySection />
    </div>
  )
}
