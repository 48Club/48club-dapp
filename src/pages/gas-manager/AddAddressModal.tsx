import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import useSignMessage from '@/hooks/useSignMessage'
import { isAddress } from 'ethers/lib/utils';
import { useEthers } from '@usedapp/core';

interface ManageAddressModalProps {
  open: boolean;
  onOk: (addresses: string[], signature: string) => void;
  onCancel: () => void;
}

export default function AddAddressModal({ open, onOk, onCancel }: ManageAddressModalProps) {
  const [form] = Form.useForm();
  const { signMessage } = useSignMessage()
  const { account } = useEthers();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let addresses: string[] = values.addresses
        .split(',')
        .map((addr: string) => addr.trim().toLowerCase())
        .filter((addr: string) => !!addr);
      if (!addresses.length) {
        message.error('请输入至少一个地址');
        return;
      }
      // 校验每个地址
      for (const addr of addresses) {
        if (!isAddress(addr)) {
          message.error(`地址格式错误: ${addr}`);
          return;
        }
      }
      if (!account) {
        message.error('请先连接钱包');
        return;
      }
      // 拼接签名消息
      const msg = `i authorize master account ${account.toLowerCase()} to pay all gas fees incurred by transactions from sub-accounts ${addresses.join(',')}`;
      const signature = await signMessage(msg);
      onOk(addresses, signature);
    } catch (e: any) {
      if (e?.message) message.error(e.message);
    }
  };

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">添加地址</div>}
      onOk={handleOk}
      onCancel={onCancel}
      okText="添加地址"
      cancelText="取消"
      centered
      destroyOnClose
      className="edit-gas-modal"
    >
      <div className="mb-2 text-gray-700">输入多个地址请用英文逗号分隔。支持任何格式。</div>
      <Form form={form} layout="vertical">
        <Form.Item
          name="addresses"
          rules={[{ required: true, message: '请输入地址' }]}
        >
          <Input.TextArea
            className="font-mono min-h-[120px] rounded-lg"
            placeholder="0x..."
            autoSize={{ minRows: 6, maxRows: 12 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
} 