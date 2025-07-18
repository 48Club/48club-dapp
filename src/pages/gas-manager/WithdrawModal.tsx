import React, { useEffect } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import { useTranslation } from 'react-i18next';
import { formatEther } from 'ethers/lib/utils'

interface WithdrawModalProps {
  open: boolean
  onOk: (amount: string) => void
  onCancel: () => void
  loading?: boolean
  userBalance?: string // 合约中的 BNB 余额
}

export default function WithdrawModal({ open, onOk, onCancel, loading = false, userBalance }: WithdrawModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) form.resetFields()
  }, [open, form])

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">{t('gas.withdraw_btn')} BNB</div>}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose
      className="edit-gas-modal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={<div className='flex items-center justify-between w-full'>
            <span className="font-medium">{t('gas.withdraw_amount')}</span>
            <span className='text-sm text-gray-500 underline cursor-pointer' onClick={() => {
              if (userBalance) {
                form.setFieldsValue({ amount: userBalance });
              }
            }}>
              {t('gas.balance')}: {userBalance ? userBalance : '--'} BNB
            </span>
            </div>}
          name="amount"
          rules={[{ required: true, message: t('gas.withdraw_amount_required') }, {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              if (Number(value) > Number(userBalance || 0)) {
                return Promise.reject(new Error(t('gas.withdraw_amount_greater_than_balance')));
              }
              if (Number(value) <= 0) {
                return Promise.reject(new Error(t('gas.withdraw_amount_must_greater_than_zero')));
              }
              return Promise.resolve();
            }
          }]}
          className="form-label-item"
        >
          <Input type="number" min={0} step={0.001} placeholder={t('gas.enter_withdraw_amount')} className="rounded-lg" />
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
          {t('gas.withdraw_btn')}
        </Button>
      </Form>
    </Modal>
  )
}
