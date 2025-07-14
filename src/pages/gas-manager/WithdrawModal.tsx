import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { formatEther } from 'ethers/lib/utils';

interface WithdrawModalProps {
  open: boolean;
  onOk: (amount: string) => void;
  onCancel: () => void;
  loading?: boolean;
  userBalance?: string; // 合约中的 BNB 余额
}

export default function WithdrawModal({ open, onOk, onCancel, loading = false, userBalance }: WithdrawModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">提现 BNB</div>}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>取消</Button>
      ]}
      centered
      destroyOnClose
      className="edit-gas-modal"
    >
      <Form form={form} layout="vertical">
        <Form.Item label={<span className="font-medium">提现数量 (BNB)</span>} name="amount" rules={[{ required: true, message: '请输入提现数量' }]}> 
          <Input
            type="number"
            min={0}
            step={0.001}
            placeholder="请输入提现数量"
            className="rounded-lg"
            addonAfter={
              <span style={{ color: '#888', fontSize: 12 }}>
                余额: {userBalance ? userBalance : '--'} BNB
              </span>
            }
          />
        </Form.Item>
        <Button
          type="primary"
          className="w-full mt-2 mb-6 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-medium"
          loading={loading}
          onClick={() => {
            form.validateFields().then(values => {
              onOk(values.amount);
            });
          }}
        >
          提现
        </Button>
      </Form>
    </Modal>
  );
} 