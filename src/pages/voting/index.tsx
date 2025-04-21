import { useState } from 'react'
import CardSection from './CardSection'
import FilterSection from './FilterSection'
import HeaderSection from './HeaderSection'
import { GovInfoFilterContext, GovSetFilterContext } from '../../hooks/gov/useGov'

export default function Voting() {
  const [status, setStatus] = useState('all')
  const [timeRanges, setTimeRanges] = useState([])
  const [related, setRelated] = useState(false)
  const [claimable, setClaimable] = useState(false)
  const [voted, setVoted] = useState(false)
  return (
    <div className="px-4 max-w-6xl mx-auto">
      <HeaderSection />
      <GovInfoFilterContext.Provider value={{
          status,
          timeRanges,
          related,
          claimable,
          voted
        }}>
          <GovSetFilterContext.Provider value={{
            setStatus,
            setTimeRanges,
            setRelated,
            setClaimable,
            setVoted
          }}>
            <FilterSection />
          </GovSetFilterContext.Provider>
        </GovInfoFilterContext.Provider>

        <GovInfoFilterContext.Provider value={{
          status,
          timeRanges,
          related,
          claimable,
          voted,
        }}>
          <CardSection />
        </GovInfoFilterContext.Provider>
    </div>
  )
}
