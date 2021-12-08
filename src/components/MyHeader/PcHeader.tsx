import React from 'react'
import Web3Status from './Web3Status'

export default function PcHeader() {
  return (
    <div className="border-b-4 border-primary mb-6">
      <div className="py-4 px-2 max-w-6xl mx-auto w-full">
        <div className="flex flex-row justify-between items-center">
          <div>&nbsp;</div>
          <Web3Status />
        </div>
      </div>
    </div>
  )
}
