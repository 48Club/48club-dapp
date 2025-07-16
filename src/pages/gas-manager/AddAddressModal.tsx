import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import useSignMessage from '@/hooks/useSignMessage'
import { isAddress } from 'ethers/lib/utils';
import { useEthers } from '@usedapp/core';
import { bindSubAccount } from '@/utils/axios';

interface ManageAddressModalProps {
  open: boolean;
  onOk: (addresses: string[]) => void;
  onCancel: () => void;
}

export default function AddAddressModal({ open, onOk, onCancel }: ManageAddressModalProps) {
  const { t } = useTranslation();
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
        message.error(t('gas.enter_at_least_one_address'));
        return;
      }
      // 校验每个地址
      for (const addr of addresses) {
        if (!isAddress(addr)) {
          message.error(`${t('gas.address_format_error')}: ${addr}`);
          return;
        }
      }
      if (!account) {
        message.error(t('gas.please_connect_wallet'));
        return;
      }
      await onOk(addresses)
      onCancel()
    } catch (e: any) {
      if (e?.message) message.error(e.message);
    }
  };

  return (
    <Modal
      open={open}
      title={<div className="text-xl font-bold p-[20px]">{t('gas.add_address_title')}</div>}
      onOk={handleOk}
      onCancel={onCancel}
      okText={t('gas.add_address')}
      cancelText={t('gas.cancel')}
      centered
      destroyOnClose
      className="edit-gas-modal"
    >
      <div className="mb-2 text-gray-700">{t('gas.input_multiple_addresses')}</div>
      <Form form={form} layout="vertical">
        <Form.Item
          name="addresses"
          rules={[{ required: true, message: t('gas.enter_address') }]}
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