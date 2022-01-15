import React from 'react'
import HeaderSection from './HeaderSection'
import ManageSection from './ManageSection'
import MemberSection from './MemberSection'
import StandardSection from './StandardSection'

export default function Manage() {
  return (
    <div className="px-4">
      <HeaderSection />
      <StandardSection />
      <MemberSection />
      <ManageSection />
    </div>
  )
}
