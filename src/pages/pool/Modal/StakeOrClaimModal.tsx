import React from 'react'
import { Button, Modal, ModalProps, Input } from 'antd'

export const StakeOrClaimModal = (props: Pick<ModalProps, 'visible' | 'onCancel'>) => {
  return (
    <Modal {...props} footer={false} closeIcon={null} className="rounded-xl">
      <div className="p-6 rounded-xl">
        <div className="relative text-center text-[#1E1E1E] text-xl font-bold">
          解质押代币
          <img
            src="/static/close.svg"
            className="absolute top-0 right-0 transform -translate-y-1/2 cursor-pointer"
            alt=""
            onClick={props.onCancel}
          />
        </div>
        <div className="flex gap-11">
          <div className="flex-1 flex flex-col gap-3">
            <span>质押币种</span>
            <Input size="large" readOnly className="h-12 border-none rounded bg-light-white" />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <span>奖励币种</span>
            <Input size="large" readOnly className="h-12 border-none rounded bg-light-white" />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <span>解质押数量</span>
          <Input size="large" className="h-12 border-none rounded bg-light-white" />
        </div>
        <div className="mt-8 w-full flex justify-center">
          <Button type="primary" size="large" className="w-50 h-12 rounded">
            确定
          </Button>
        </div>
      </div>
    </Modal>
  )
}
