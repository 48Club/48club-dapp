import React, { useEffect } from 'react'
import { Modal, Form, Input, Button, Table } from 'antd'
import { formatEther } from 'ethers/lib/utils'

interface RecordItem {
  time: string
  address: string
  amount: string
}

interface RechargeModalProps {
  open: boolean
  onOk: (amount: string) => void
  onCancel: () => void
  loading?: boolean
  bnbBalance?: string // 新增
}

export default function RechargeModal({ open, onOk, onCancel, loading = false, bnbBalance }: RechargeModalProps) {
  const [form] = Form.useForm()
  const [tab, setTab] = React.useState<'recharge' | 'consume'>('recharge')

  useEffect(() => {
    if (open) form.resetFields()
  }, [open, form])

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">充值 BNB</div>}
      onCancel={onCancel}
      closable={true}
      footer={null}
      centered
      destroyOnClose
      className="edit-gas-modal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">充值数量 (BNB)</span>
              <span
                className="text-sm text-gray-500 underline cursor-pointer"
                onClick={() => {
                  if (bnbBalance) {
                    const total = Number(formatEther(bnbBalance));
                    const reserved = 0.001;
                    const available = total > reserved ? (total - reserved) : 0;
                    form.setFieldsValue({ amount: available > 0 ? available.toFixed(6) : '0' });
                  }
                }}
              >
                余额: {bnbBalance ? formatEther(bnbBalance) : '--'} BNB
              </span>
            </div>
          }
          name="amount"
          rules={[{ required: true, message: '请输入充值数量' }, {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              if (Number(value) > Number(bnbBalance ? formatEther(bnbBalance) : 0)) {
                return Promise.reject(new Error('充值金额不能大于余额'));
              }
              if (Number(value) <= 0) {
                return Promise.reject(new Error('充值金额必须大于0'));
              }
              return Promise.resolve();
            }
          }]}
          className="form-label-item"
        >
          <Input type="number" min={0} step={0.001} placeholder="请输入充值数量" className="rounded-lg" />
        </Form.Item>
        <Button
          type="primary"
          className="w-full mt-2 mb-6 rounded-lg text-lg font-medium"
          loading={loading}
          onClick={() => {
            form.validateFields().then((values) => {
              onOk(values.amount)
            })
          }}
        >
          充值
        </Button>
      </Form>
    </Modal>
  )
}
