import Back from 'components/Back'
import React from 'react'
import HeaderSection from './HeaderSection'
import ResultSection from './ResultSection'
import VoteSection from './VoteSection'
import DetailSection from './DetailSection'

export default function VotingDetail(props) {
  console.log(props.match.params.id)
  return (
    <div className="px-4 pt-3">
      <Back />
      <HeaderSection />
      <VoteSection />
      <ResultSection />
      <DetailSection />
    </div>
  )
}
