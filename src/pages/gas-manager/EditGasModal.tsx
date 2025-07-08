import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useEthers } from '@usedapp/core';
import { parseUnits } from 'ethers/lib/utils';
import useSignMessage from '@/hooks/useSignMessage';

interface EditGasModalProps {
  open: boolean;
  initialValue?: string;
  onOk: (value: string, signature: string) => void;
  onCancel: () => void;
}

export default function EditGasModal({ open, initialValue = '', onOk, onCancel }: EditGasModalProps) {
  const [form] = Form.useForm();
  const { account } = useEthers();
  const { signMessage } = useSignMessage();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ gas: initialValue });
    }
  }, [initialValue, open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!account) {
        message.error('请先连接钱包');
        return;
      }
      // 金额转为wei
      const wei = parseUnits(values.gas, 18).toString();
      const msg = `I authorize master account ${account.toLowerCase()} to set gas tip to ${wei} wei`;
      const signature = await signMessage(msg);
      onOk(values.gas, signature);
    } catch (e: any) {
      if (e?.message) message.error(e.message);
    }
  };

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">编辑 Gas Price</div>}
      onOk={handleOk}
      onCancel={onCancel}
      okText="设置"
      cancelText="取消"
      centered
      destroyOnClose
      className='edit-gas-modal'
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ gas: initialValue }}
      >
        <Form.Item
          label={<span className="font-medium">Gas Price</span>}
          name="gas"
          rules={[{ required: true, message: '请输入 Gas Price' }]}
        >
          <Input
            type="number"
            min={0}
            step={0.001}
            placeholder="请输入 Gas Price"
            className="rounded-lg"
            autoFocus
          />
        </Form.Item>
      </Form>
    </Modal>
  );
} 