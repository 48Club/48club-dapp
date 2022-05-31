import React from 'react'

import BannerSection from './BannerSection'
import CaseSection from './CaseSection'
import ReviewSection from './ReviewSection'
import './index.less'

export default function Governance() {
  return (
    <div className="committee-page max-w-6xl mx-auto">
      <BannerSection />
      <CaseSection />
      <ReviewSection />
    </div>
  )
}
