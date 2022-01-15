import { Button } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function HeaderSection() {
  const { t } = useTranslation()
  const list = [1, 2, 3, 4]
  return (
    <div className="mt-14 flex flex-col">
      {list.map((item) => {
        return (
          <div className="w-full p-4 pb-8 flex flex-col shadow text-xs mb-10">
            <img
              src="/static/manage-header.png"
              alt=""
              className="w-full"
            />
            <span className="mt-4 text-light-black text-base">Louts</span>
            <span className="mt-2 text-gray text-xs">
              Here is content here is content here is content here is content
              here is content here is content here is content here is content
              here is conte...
            </span>
          </div>
        )
      })}
      <div className="pb-10 text-center">
        <Button className="h-9 text-sm font-medium rounded text-light-black bg-gray">
          查看更多
        </Button>
      </div>
    </div>
  )
}
