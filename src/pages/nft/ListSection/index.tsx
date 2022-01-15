import { Button } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import edit from '../../../assets/images/icon/edit.svg'
import lotus from '../../../assets/images/test/lotus.png'
export default function ListSection() {
  const { t } = useTranslation()
  const list = [1, 2, 3, 4]
  return (
    <div className="flex flex-col items-center">
      <div className="mt-0 md:mt-16 flex flex-col md:flex-row md:flex-wrap w-full">
        {list.map((item) => {
          return (
            <div className="w-full md:w-1/4 px-3 flex flex-col text-xs mb-10">
              <div className="relative shadow p-4 pb-8">
                <img
                  src={lotus}
                  alt=""
                  className="w-full"
                />
                  <img className="absolute top-7 right-7 w-8 h-8 cursor-pointer" src={edit}/>
                <div className="mt-4 text-light-black text-base">Louts</div>
                <div className="mt-2 text-gray text-xs">
                  Here is content here is content here is content here is content
                  here is content here is content here is content here is content
                  here is conte...
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="pb-28">
        <Button className="h-9 text-sm font-medium rounded text-light-black bg-gray">
          查看更多
        </Button>
      </div>
    </div>
  )
}
