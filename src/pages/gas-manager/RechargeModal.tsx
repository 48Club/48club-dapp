import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Table } from 'antd';

interface RecordItem {
  time: string;
  address: string;
  amount: string;
}

interface RechargeModalProps {
  open: boolean;
  onOk: (token: string, amount: string) => void;
  onCancel: () => void;
}

const rechargeRecords: RecordItem[] = [
  { time: '2025/08/09 12:12:12', address: '0x7E63****3da6F', amount: '10 BNB' },
  { time: '2025/08/09 12:12:12', address: '0x7E63****3da6F', amount: '12BNB' },
  { time: '2025/08/09 12:12:12', address: '0x7E63****3da6F', amount: '10 BNB' },
  { time: '2025/08/09 12:12:12', address: '0x7E63****3da6F', amount: '12BNB' },
];
const consumeRecords: RecordItem[] = [
  { time: '2025/08/09 12:12:12', address: '0x7E63****3da6F', amount: '1 BNB' },
  { time: '2025/08/09 12:12:12', address: '0x7E63****3da6F', amount: '2BNB' },
];

const columns = [
  { title: '时间', dataIndex: 'time', key: 'time', align: 'left' as const },
  { title: '地址', dataIndex: 'address', key: 'address', align: 'left' as const },
  { title: '数量', dataIndex: 'amount', key: 'amount', align: 'left' as const },
];

export default function RechargeModal({ open, onOk, onCancel }: RechargeModalProps) {
  const [form] = Form.useForm();
  const [tab, setTab] = React.useState<'recharge' | 'consume'>('recharge');

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const records = tab === 'recharge' ? rechargeRecords : consumeRecords;

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
        <Form.Item label={<span className="font-medium">币种</span>} name="token" rules={[{ required: true, message: '请输入币种' }]}> 
          <Input placeholder="请输入币种" className="rounded-lg" />
        </Form.Item>
        <Form.Item label={<span className="font-medium">数量</span>} name="amount" rules={[{ required: true, message: '请输入数量' }]}> 
          <Input type="number" min={0} placeholder="请输入数量" className="rounded-lg" />
        </Form.Item>
        <Button
          type="primary"
          className="w-full mt-2 mb-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-medium"
          onClick={() => {
            form.validateFields().then(values => {
              onOk(values.token, values.amount);
            });
          }}
        >
          充值
        </Button>
      </Form>
      <div className="flex mb-2 border-b mt-4">
        <Button type="link" className={`mr-4 pb-1 text-base ${tab === 'recharge' ? 'text-yellow-500 border-b-2 border-yellow-500 font-bold' : 'text-gray-500'}`} onClick={() => setTab('recharge')}>充值记录</Button>
        <Button type="link" className={`pb-1 text-base ${tab === 'consume' ? 'text-yellow-500 border-b-2 border-yellow-500 font-bold' : 'text-gray-500'}`} onClick={() => setTab('consume')}>消费记录</Button>
      </div>
      <Table
        columns={columns}
        dataSource={records.map((item, idx) => ({ ...item, key: idx }))}
        pagination={false}
        size="small"
        bordered
        rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
        className="custom-ant-table"
      />
    </Modal>
  );
} 