import React from "react"
import MobileHeaderSection from './MobileHeaderSection'
import ListSection from './ListSection'
import PcHeaderSection from './PcHeaderSection'

export default function NFT() {
  return (
    <div className="px-4 max-w-6xl mx-auto">
      <div className="block md:hidden">
        <MobileHeaderSection />
      </div>
      <div className="hidden md:block">
        <PcHeaderSection />
      </div>
      <ListSection />
    </div>
  )
}
