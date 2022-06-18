import React, { useState } from 'react'
import HeaderSection from './HeaderSection'
import { FilterSection } from './FilterSection'
import { PoolCardSection } from './CardSection'
import { CreatePoolModal, StakeOrClaimModal } from './Modal'

export default function Pool() {
  const [createShow, setCreateShow] = useState(true)

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <HeaderSection />
      <FilterSection />
      <PoolCardSection />

      <CreatePoolModal visible={createShow} onCancel={() => setCreateShow(false)} />
      <StakeOrClaimModal visible={createShow} onCancel={() => setCreateShow(false)} />
    </div>
  )
}
