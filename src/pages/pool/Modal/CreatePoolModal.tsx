import React, { useMemo } from 'react'
import { Button, Modal, ModalProps, Form, Input, Select, DatePicker } from 'antd'
import { usePoolFactory } from '../../../hooks/pool/usePool'

export const CreatePoolModal = (props: Pick<ModalProps, 'visible' | 'onCancel'>) => {
  const { poolAddresses, deployLoading, onDeploy, updateRewardLoading } = usePoolFactory()
  const [form] = Form.useForm()

  const lastAddress = useMemo(() => {
    return poolAddresses?.[0] ?? ''
  }, [poolAddresses])

  console.log(lastAddress)

  return (
    <Modal {...props} footer={false} closeIcon={null} className="rounded-xl">
      <div className="p-6 rounded-xl">
        <div className="relative text-center text-[#1E1E1E] text-xl font-bold">
          创建质押池
          <img
            src="/static/close.svg"
            className="absolute top-0 right-0 transform -translate-y-1/2 cursor-pointer"
            alt=""
            onClick={props.onCancel}
          />
        </div>

        <Form form={form} layout="vertical" size="large">
          <Form.Item label="质押币种">
            {/* <Select className="h-12 border-none rounded bg-light-white" placeholder="请选择" /> */}
            <Input className="h-12 border-none rounded bg-light-white" placeholder="请输入" />
          </Form.Item>
          <Form.Item label="奖励币种">
            <Input className="h-12 border-none rounded bg-light-white" placeholder="请输入" />
          </Form.Item>
          <Form.Item label="奖励总量">
            <Input className="h-12 border-none rounded bg-light-white" placeholder="请输入" />
          </Form.Item>
          <Form.Item label="释放速率">
            <Input className="h-12 border-none rounded bg-light-white" placeholder="请输入" />
          </Form.Item>
          {/* <Form.Item label="开始时间">
            <DatePicker
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              className="h-12 border-none rounded bg-light-white"
            />
          </Form.Item> */}
        </Form>

        <div className="w-full flex justify-center gap-6 flex-wrap">
          <Button size="large" className="w-50 h-12 bg-gray rounded" onClick={props.onCancel}>
            取消
          </Button>
          <Button type="primary" size="large" className="w-50 h-12 rounded">
            确定
          </Button>
        </div>
      </div>
    </Modal>
  )
}
