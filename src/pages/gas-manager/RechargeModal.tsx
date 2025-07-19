import React, { useEffect } from 'react'
import { Modal, Form, Input, Button, Table } from 'antd'
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [form] = Form.useForm()
  const [tab, setTab] = React.useState<'recharge' | 'consume'>('recharge')

  useEffect(() => {
    if (open) form.resetFields()
  }, [open, form])

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">{t('gas.recharge_btn')} BNB</div>}
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
              <span className="font-medium">{t('gas.recharge_amount')}</span>
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
                {t('gas.balance')}: {bnbBalance ? formatEther(bnbBalance) : '--'} BNB
              </span>
            </div>
          }
          name="amount"
          rules={[{ required: true, message: t('gas.amount_required') }, {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              if (Number(value) > Number(bnbBalance ? formatEther(bnbBalance) : 0)) {
                return Promise.reject(new Error(t('gas.amount_greater_than_balance')));
              }
              if (Number(value) <= 0) {
                return Promise.reject(new Error(t('gas.amount_must_greater_than_zero')));
              }
              return Promise.resolve();
            }
          }]}
          className="form-label-item"
        >
          <Input type="number" min={0} step={0.001} placeholder={t('gas.enter_recharge_amount')} className="rounded-lg" />
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
          {t('gas.recharge_btn')}
        </Button>
      </Form>
    </Modal>
  )
}
