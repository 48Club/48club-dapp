import { CloseOutlined } from '@ant-design/icons'
import { Button, Modal, Radio } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

import './index.less'

export default function NFTModal() {
  const { t } = useTranslation()
  const header = (
    <div className="text-center relative">
      <span className="font-bold text-lg text-light-black">选择NFT</span>
      <CloseOutlined
        className="absolute r-0 text-xs font-bold leading-7 text-gray"
        style={{ right: 0 }}
      />
    </div>
  )
  const list = [1, 2, 3, 4, 5]
  return (
    <Modal
      title={header}
      footer={null}
      visible={true}
      width="100%"
      closable={true}
      wrapClassName="flex flex-col justify-center px-4 nft-modal"
      onCancel={() => {
        console.log(123)
      }}
      onOk={() => {
        console.log(123)
      }}
    >
      <div className="px-6">
        {list.map((item) => {
          return (
            <div className="flex flex-col border-b border-gray">
              <div className="flex flex-row justify-between mt-6 items-center">
                <img
                  src="https://wx1.sinaimg.cn/mw690/783ab46bly1gx3ds68irej20u00u0dm9.jpg"
                  className="w-20 h-20"
                  alt=""
                />
                <Radio />
              </div>
              <span className="mt-4 text-base text-light-black">Louts</span>
              <span className="mt-2 text-xs mb-6 text-gray">
                Here is content here is content here is content here is content
                here is content here is content here is content here is content
                here is conte...
              </span>
            </div>
          )
        })}
      </div>
      <div className="text-center py-6 absolute bottom-0 w-full bg-white">
        <Button className="h-12 text-sm w-50 text-light-black bg-yellow">
          确定
        </Button>
      </div>
    </Modal>
  )
}
