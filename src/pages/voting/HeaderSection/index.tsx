import { NavLink } from 'react-router-dom'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

export default function HeaderSection() {
  const { t } = useTranslation()
  return (
    <div className="pt-4 w-auto mb-10">
      <div
        className="h-96 flex flex-col rounded-2xl items-center px-6 bg-another-white"
      >
        <img src="/static/voting-header.png" className="w-48 mb-10 mt-4" alt="" />
        <span className="font-bold text-2xl leading-7 mb-4 text-light-black">
          KOGE Proposal List
        </span>
        <span className="text-base leading-6 mb-5 text-dark-gray">
          Review the list of all proposals
        </span>

        <NavLink to="/voting/create">
          <Button className="h-10 text-sm font-medium w-full rounded text-light-black bg-gray">
            New Proposal
          </Button>
        </NavLink>
      </div>
    </div>
  )
}
