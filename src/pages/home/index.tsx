import React from 'react'
import BannerSection from './BannerSection'
import IntroductionSection from './IntroductionSection'
import CustomerSection from './CustomerSection'
import ActivitySection from './ActivitySection'
import './index.less'

export default function Home() {
  return (
    <div className='home-page'>
      <BannerSection />
      <ActivitySection />
      <IntroductionSection />
      <CustomerSection />
    </div>
  )
}
