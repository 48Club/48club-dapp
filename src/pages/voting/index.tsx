import React, { useState } from 'react'
import CardSection from './CardSection'
import FilterSection from './FilterSection'
import HeaderSection from './HeaderSection'
import { GovInfoFilterContext, GovSetFilterContext } from '../../hooks/gov/useGov'

export default function Voting() {
  const [status, setStatus] = useState('all')
  const [timeRanges, setTimeRanges] = useState([])
  const [related, setRelated] = useState(true)

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <HeaderSection />
      <GovInfoFilterContext.Provider value={{
        status,
        timeRanges,
        related,
      }}>
        <GovSetFilterContext.Provider value={{
          setStatus,
          setTimeRanges,
          setRelated
        }}>
          <FilterSection />
        </GovSetFilterContext.Provider>
      </GovInfoFilterContext.Provider>

      <GovInfoFilterContext.Provider value={{
        status,
        timeRanges,
        related,
      }}>
        <CardSection />
      </GovInfoFilterContext.Provider>
    </div>
  )
}
