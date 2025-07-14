import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Table } from 'antd';
import { formatEther } from 'ethers/lib/utils';

interface RecordItem {
  time: string;
  address: string;
  amount: string;
}

interface RechargeModalProps {
  open: boolean;
  onOk: (amount: string) => void;
  onCancel: () => void;
  loading?: boolean;
  bnbBalance?: string; // 新增
}

export default function RechargeModal({ open, onOk, onCancel, loading = false, bnbBalance }: RechargeModalProps) {
  const [form] = Form.useForm();
  const [tab, setTab] = React.useState<'recharge' | 'consume'>('recharge');

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">充值 BNB</div>}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>取消</Button>
      ]}
      centered
      destroyOnClose
      className="edit-gas-modal"
    >
      <Form form={form} layout="vertical">
        <Form.Item label={<span className="font-medium">充值数量 (BNB)</span>} name="amount" rules={[{ required: true, message: '请输入充值数量' }]}> 
          <Input
            type="number"
            min={0}
            step={0.001}
            placeholder="请输入充值数量"
            className="rounded-lg"
            addonAfter={
              <span style={{ color: '#888', fontSize: 12 }}>
                余额: {bnbBalance ? formatEther(bnbBalance) : '--'} BNB
              </span>
            }
          />
        </Form.Item>
        <Button
          type="primary"
          className="w-full mt-2 mb-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-medium"
          loading={loading}
          onClick={() => {
            form.validateFields().then(values => {
              onOk(values.amount);
            });
          }}
        >
          充值
        </Button>
      </Form>
    </Modal>
  );
} 