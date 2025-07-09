import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Tabs } from 'antd';
import './index.css';
import EditGasModal from './EditGasModal';
import AddAddressModal from './AddAddressModal';
import RechargeModal from './RechargeModal';
import { useEthers } from '@usedapp/core';
import useGasInfo from '@/hooks/gas/useGasInfo';
import useSignMessage from '@/hooks/useSignMessage';
import { useOpenModal } from '@/state/application/hooks';
import { ApplicationModal } from '@/state/application/actions';
import { getSubAccount } from '@/utils/axios';

const address = '0x7E3B9009eCf5D8DBB8433e74C8241632C6B3da6F';
const initialGasPrice = 0.001;
const bindCount = 12;
const balance = 100;
const initialAddressList = Array(8).fill({
  time: '2025/08/09 12:12:12',
  address,
});

export default function GasManager() {
  const { account } = useEthers()
  const [gasPrice, setGasPrice] = useState(initialGasPrice);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [manageAddressOpen, setManageAddressOpen] = useState(false);
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [addressList, setAddressList] = useState(initialAddressList.map((item, idx) => ({ ...item, key: idx })));
  const { depositRecords, withdrawRecords, authorizedSpendRecords, loadDepositRecords, loadWithdrawRecords, loadAuthorizedSpendRecords } = useGasInfo();
  const { signMessage } = useSignMessage();
  const openwallet = useOpenModal(ApplicationModal.WALLET)
  const recordColumns = [
    { title: '时间', dataIndex: 'time', key: 'time', align: 'left' as const },
    { title: '地址', dataIndex: 'address', key: 'address', align: 'left' as const },
    { title: '数量', dataIndex: 'amount', key: 'amount', align: 'left' as const },
  ];
  const [mainTab, setMainTab] = useState<'address' | 'recharge' | 'consume' | 'withdraw'>('address');
  const loadSubAccount = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const msg = `check all sub-accounts under master account ${account?.toLowerCase()}, at unix timestamp ${timestamp}`;
    console.log(msg, 'msg')
    const sign = await signMessage(msg);
    getSubAccount({
      account: account?.toLowerCase(),
      sign,
      timestamp,
    })
  }
  useEffect(() => {
    if (account) {
      // loadDepositRecords(account)
      // loadWithdrawRecords(account)
      // loadAuthorizedSpendRecords(account)
      loadSubAccount()
    }
  }, [account])

  const handleEdit = () => setEditModalOpen(true);
  const handleEditSave = (value: string) => {
    setGasPrice(Number(value));
    setEditModalOpen(false);
  };

  const handleDelete = (key: number) => {
    setAddressList(list => list.filter(item => item.key !== key));
    message.success('删除成功');
  };

  const handleRemoveAll = async () => {
    if (!account) return;
    const msg = `I authorize master account ${account.toLowerCase()} to stop paying gas fees for all sub-accounts`;
    try {
      await signMessage(msg);
      setAddressList([]);
      message.success('已移除全部子账户');
    } catch (e: any) {
      message.error(e?.message || '签名失败');
    }
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      align: 'left' as const,
      render: (text: string) => <span className="font-mono text-gray-700">{text}</span>,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      align: 'left' as const,
      render: (text: string) => <span className="font-mono text-blue-700">{text}</span>,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Popconfirm title="确定删除该地址吗？" onConfirm={() => handleDelete(record.key)} okText="删除" cancelText="取消" disabled={!account}>
          <Button type="link" size="small" className="text-yellow-500" disabled={!account}>删除</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-2">
      <div className="max-w-[1000px] mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-12 border border-[#e0e0e0] mt-[0px]">
          <div className="text-center text-3xl font-extrabold tracking-wide mb-2">48 Rpc Prepaid Gas</div>
          <div className="flex justify-center mb-4 items-center gap-2">
            <span className="text-gray-600 mr-2">您的地址：</span>
            <span className="font-mono text-blue-700 bg-blue-50 rounded px-2 py-1 text-base">{account}</span>
            {!account && (
              <Button
                className="ml-4 px-4 py-1 bg-primary text-white rounded font-bold shadow transition"
                onClick={openwallet}
              >
                连接钱包
              </Button>
            )}
          </div>
          <div className="text-center text-base text-gray-500 mb-8">Be the first to quickly recharge gas</div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 md:gap-0">
            <div className="flex flex-col items-center bg-blue-50 rounded-xl px-8 py-6 shadow flex-1 mx-2 min-w-[220px]">
              <div className="text-4xl font-extrabold text-primary mb-1">{account ? addressList.length : '--'}</div>
              <div className="text-gray-600 mb-2">绑定地址数量</div>
              <Button className="px-6 py-2 rounded-lg font-bold shadow transition" onClick={() => setManageAddressOpen(true)} disabled={!account}>绑定地址</Button>
            </div>
            <div className="flex flex-col items-center bg-gray-50 rounded-xl px-8 py-6 shadow flex-1 mx-2 min-w-[220px]">
              <div className="text-4xl font-extrabold mb-1 text-primary">{account ? gasPrice : '--'}</div>
              <div className="text-gray-600 mb-2">Gas Price</div>
              <Button onClick={handleEdit} className="px-6 py-2 rounded-lg font-bold shadow transition" disabled={!account}>编辑</Button>
            </div>
            <div className="flex flex-col items-center bg-yellow-50 rounded-xl px-8 py-6 shadow flex-1 mx-2 min-w-[220px]">
              <div className="text-4xl font-extrabold text-primary mb-1">{account ? balance : '--'} <span className="text-base font-normal">BNB</span></div>
              <div className="text-gray-600 mb-2">账户余额</div>
              <div className="flex gap-2">
                <Button className="px-6 py-2 rounded-lg font-bold shadow transition" onClick={() => setRechargeOpen(true)} disabled={!account}>充值</Button>
                <Button className="px-6 py-2 rounded-lg font-bold shadow transition" onClick={() => {/* TODO: 提现逻辑 */}} disabled={!account}>提现</Button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow border border-[#e0e0e0] p-6">
            <Tabs activeKey={mainTab} onChange={key => setMainTab(key as 'address' | 'recharge' | 'consume' | 'withdraw')}>
              <Tabs.TabPane tab="地址列表" key="address">
                <div className="mb-3 flex items-center justify-end">
                  <Button
                    className="px-4 py-2 rounded-lg shadow transition text-base text-primary bg-white"
                    onClick={handleRemoveAll}
                    disabled={!account}
                  >
                    移除全部子账户
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-xl shadow border border-[#e0e0e0] bg-white">
                  <Table
                    columns={columns}
                    dataSource={addressList}
                    pagination={false}
                    bordered
                    rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                    className="custom-ant-table"
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="充值记录" key="recharge">
                <Table
                  columns={recordColumns}
                  dataSource={depositRecords?.map((item, idx) => ({ ...item, key: idx })) || []}
                  pagination={false}
                  size="small"
                  bordered
                  rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                  className="custom-ant-table"
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="消费记录" key="consume">
                <Table
                  columns={recordColumns}
                  dataSource={withdrawRecords?.map((item, idx) => ({ ...item, key: idx })) || []}
                  pagination={false}
                  size="small"
                  bordered
                  rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                  className="custom-ant-table"
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="提现记录" key="withdraw">
                <Table
                  columns={recordColumns}
                  dataSource={withdrawRecords?.map((item, idx) => ({ ...item, key: idx })) || []}
                  pagination={false}
                  size="small"
                  bordered
                  rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                  className="custom-ant-table"
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <EditGasModal
        open={editModalOpen}
        initialValue={gasPrice.toString()}
        onOk={handleEditSave}
        onCancel={() => setEditModalOpen(false)}
      />
      <AddAddressModal
        open={manageAddressOpen}
        onOk={() => setManageAddressOpen(false)}
        onCancel={() => setManageAddressOpen(false)}
      />
      <RechargeModal
        open={rechargeOpen}
        onOk={() => setRechargeOpen(false)}
        onCancel={() => setRechargeOpen(false)}
      />
    </div>
  );
} 