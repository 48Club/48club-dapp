import Back from 'components/Back'
import React from 'react'
import HeaderSection from './HeaderSection'
import ResultSection from './ResultSection'
import VoteSection from './VoteSection'

export default function VotingDetail() {
  return (
    <div className="px-4 max-w-6xl mx-auto pb-20">
      <Back />
      <HeaderSection />
      <VoteSection />
      <ResultSection />
      {/*<DetailSection />*/}
    </div>
  )
}
