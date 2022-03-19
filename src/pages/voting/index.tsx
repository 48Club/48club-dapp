import React from 'react'
import CardSection from './CardSection'
import FilterSection from './FilterSection'
import HeaderSection from './HeaderSection'

export default function Voting() {
  return (
    <div className="px-4 max-w-6xl mx-auto">
      <HeaderSection />
      <FilterSection onSwitch={(val) => { console.log(val)}} />
      <CardSection />
    </div>
  )
}
