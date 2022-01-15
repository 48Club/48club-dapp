import React from 'react'
import StakingSection from './StakingSection'
import RecordSection from './RecordSection'
import SummarySection from './SummarySection'

export default function Staking() {
  return (
    <div className="px-4 max-w-6xl mx-auto">
      <SummarySection />
      <StakingSection />
      <RecordSection />
    </div>
  )
}
