import { CheckCircleTwoTone } from '@ant-design/icons'
import { Button } from 'antd'
import Tag from 'components/Tag'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function CardSection() {
  const { t } = useTranslation()
  const list = [1, 2, 3]
  return (
    <div className="pt-4 w-auto mb-20">
      {list.map((item) => {
        return (
          <div className="w-full mb-10 flex flex-col p-6 shadow">
            <Tag type="doing" />
            <span className="mt-4 text-base leading-6 mb-2 font-medium text-yellow">
              KOGE 由 0x4f45...da34 提出
            </span>
            <span className="font-blod text-xl leading-6 break-words mb-2 text-light-black">
              KOGE第四季度回购方案
            </span>
            <span className="break-words text-sm leading-5 mb-12 text-dark-gray">
              KORE第四季度回购方案具体内容，KORE第四季度回购方案具体内容，KORE第四季度回购方案具体内容，KORE第四季度回购方案具体内容，KORE第四季度回购方案具体内容。
            </span>
            <div className="flex flex-row mb-2">
              <CheckCircleTwoTone
                twoToneColor="#08C849"
                className="w-3.5 h-3.5 mr-2"
              />
              <span className="text-xs leading-5 text-dark-gray">
                距离结束还有：30天 23小时 20分
              </span>
            </div>
          </div>
        )
      })}
      <div className="text-center">
        <Button className="h-9 text-sm font-medium rounded text-light-black bg-gray">
          查看更多
        </Button>
      </div>
    </div>
  )
}
