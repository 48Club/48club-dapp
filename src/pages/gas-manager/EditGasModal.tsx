import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

interface EditGasModalProps {
  open: boolean;
  initialValue?: string;
  onOk: (value: string) => void;
  onCancel: () => void;
}

export default function EditGasModal({ open, initialValue = '', onOk, onCancel }: EditGasModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ gas: initialValue });
    }
  }, [initialValue, open, form]);

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">编辑 Gas Price</div>}
      onOk={() => {
        form.validateFields().then(values => {
          onOk(values.gas);
        });
      }}
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