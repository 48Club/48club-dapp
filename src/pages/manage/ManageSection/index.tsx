import { Button } from 'antd'
import Label from 'components/Label'
import React from 'react'

export default function Manage() {
  const list = [1, 2, 3]
  return (
    <div className="">
      <Label text="理事会成员管理内容" />
      <div className="shadow mt-6 w-full rounded-lg px-6 mb-20">
        {list.map((item) => {
          return (
            <div className="flex flex-col border-b border-gray pt-6">
              <div className="flex flex-row justify-between mb-4 text-sm">
                <span className="text-gray font-medium mr-20">提名理事</span>
                <span className="text-light-black font-bold">MR.Lan</span>
              </div>
              <div className="flex flex-row justify-between mb-4 text-sm">
                <span className="text-gray font-medium mr-20">事物类型</span>
                <span className="text-light-black font-bold">弹劾现有理事</span>
              </div>
              <div className="flex flex-row justify-between mb-4 text-sm">
                <span className="text-gray font-medium mr-20">详细信息</span>
                <span className="text-light-black font-bold break-normal text-right">
                  S.lan / 0x06....7658 / 36444 KOGE
                </span>
              </div>
              <div className="flex flex-row justify-between mb-4 text-sm">
                <span className="text-gray font-medium mr-20">投票数</span>
                <span className="text-light-black font-bold">
                  3人通过 / 1人拒绝
                </span>
              </div>
              <div className="flex flex-row justify-between mb-4 text-sm">
                <span className="text-gray font-medium mr-20">状态</span>
                <span className="text-blue font-bold ">审核中</span>
              </div>
              <div className="flex flex-row justify-between mb-6">
                <span className="w-35 h-10 text-center text-sm leading-10 text-green bg-light-green rounded">
                  通过
                </span>
                <span className="w-35 h-10 text-center text-sm leading-10 text-red bg-dark-pink rounded">
                  拒绝
                </span>
              </div>
            </div>
          )
        })}
        <div className="py-10 text-center">
          <Button className="h-9 text-sm font-medium rounded text-light-black bg-gray">
            查看更多
          </Button>
        </div>
      </div>
    </div>
  )
}
