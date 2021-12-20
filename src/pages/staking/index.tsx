import React from 'react'
import PledgeSection from './PledgeSection'
import RecordSection from './RecordSection'
import SummartSection from './SummarySection'

export default function Staking() {
    return (
        <div className="px-4">
            <SummartSection />
            <PledgeSection />
            <RecordSection />
        </div>
    )
}
