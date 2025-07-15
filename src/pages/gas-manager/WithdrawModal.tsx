import React, { useEffect } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import { formatEther } from 'ethers/lib/utils'

interface WithdrawModalProps {
  open: boolean
  onOk: (amount: string) => void
  onCancel: () => void
  loading?: boolean
  userBalance?: string // 合约中的 BNB 余额
}

export default function WithdrawModal({ open, onOk, onCancel, loading = false, userBalance }: WithdrawModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) form.resetFields()
  }, [open, form])

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">提现 BNB</div>}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose
      className="edit-gas-modal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={<div className='flex items-center justify-between w-full'>
            <span className="font-medium">提现数量 (BNB)</span>
            <span className='text-sm text-gray-500 underline cursor-pointer' onClick={() => {
              if (userBalance) {
                form.setFieldsValue({ amount: userBalance });
              }
            }}>
              余额: {userBalance ? userBalance : '--'} BNB
            </span>
            </div>}
          name="amount"
          rules={[{ required: true, message: '请输入提现数量' }, {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              if (Number(value) > Number(userBalance || 0)) {
                return Promise.reject(new Error('提现金额不能大于余额'));
              }
              if (Number(value) <= 0) {
                return Promise.reject(new Error('提现金额必须大于0'));
              }
              return Promise.resolve();
            }
          }]}
          className="form-label-item"
        >
          <Input type="number" min={0} step={0.001} placeholder="请输入提现数量" className="rounded-lg" />
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
          提现
        </Button>
      </Form>
    </Modal>
  )
}
