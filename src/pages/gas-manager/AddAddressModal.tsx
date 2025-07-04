import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import useSignMessage from '@/hooks/useSignMessage'

interface ManageAddressModalProps {
  open: boolean;
  onOk: (addresses: string[]) => void;
  onCancel: () => void;
}

export default function AddAddressModal({ open, onOk, onCancel }: ManageAddressModalProps) {
  const [form] = Form.useForm();
  const { signMessage } = useSignMessage()

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">管理地址</div>}
      onOk={() => {
        form.validateFields().then(values => {
          const addresses = values.addresses
            .split('\n')
            .map((addr: string) => addr.trim())
            .filter((addr: string) => !!addr);
          onOk(addresses);
        });
      }}
      onCancel={onCancel}
      okText="添加地址"
      cancelText="取消"
      centered
      destroyOnClose
      className="edit-gas-modal"
    >
      <div className="flex mb-4 text-lg">
        <Button type="link" className="mr-6 pb-1 text-yellow-500 font-bold border-b-2 border-yellow-500 cursor-default">手动添加</Button>
        <span className="pb-1 text-gray-400 cursor-not-allowed">批量上传</span>
      </div>
      <div className="mb-2 text-gray-700">每行输入一个地址。支持任何格式。</div>
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