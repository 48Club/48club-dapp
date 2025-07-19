import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEthers } from '@usedapp/core';

interface EditGasModalProps {
  open: boolean;
  initialValue?: string;
  onOk: (value: string) => void;
  onCancel: () => void;
}

export default function EditGasModal({ open, initialValue = '', onOk, onCancel }: EditGasModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { account } = useEthers();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ gas: initialValue });
    }
  }, [initialValue, open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!account) {
        message.error(t('gas.connect_wallet'));
        return;
      }
      onOk(values.gas);
    } catch (e: any) {
      if (e?.message) message.error(e.message);
    }
  };

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">{t('gas.edit')} {t('gas.gas_price')}</div>}
      onOk={handleOk}
      onCancel={onCancel}
      okText={t('gas.set')}
      cancelText={t('gas.cancel')}
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
          label={<span className="font-medium">{t('gas.gas_price')}</span>}
          name="gas"
          rules={[{ required: true, message: t('gas.amount_required') }]}
        >
          <Input
            type="number"
            min={0}
            step={0.001}
            placeholder={t('gas.amount_required')}
            className="rounded-lg"
            autoFocus
            addonAfter="gwei"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
} 