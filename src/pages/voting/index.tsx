import { useState } from 'react'
import CardSection from './CardSection'
import FilterSection from './FilterSection'
import HeaderSection from './HeaderSection'
import { GovInfoFilterContext, GovSetFilterContext, GovListContext } from '../../hooks/gov/useGov'

export default function Voting() {
  const [status, setStatus] = useState('all')
  const [timeRanges, setTimeRanges] = useState([])
  const [related, setRelated] = useState(false)
  const [claimable, setClaimable] = useState(false)
  const [voted, setVoted] = useState(false)
  const [list, setList] = useState([])
  return (
    <div className="px-4 max-w-6xl mx-auto">
      <HeaderSection />
      <GovListContext.Provider value={{ list: list }}>
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
      </GovListContext.Provider>
    </div>
  )
}
