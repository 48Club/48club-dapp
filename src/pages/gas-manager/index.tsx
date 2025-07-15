import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Tabs, TableProps } from 'antd';
import './index.css';
import EditGasModal from './EditGasModal';
import AddAddressModal from './AddAddressModal';
import RechargeModal from './RechargeModal';
import WithdrawModal from './WithdrawModal';
import { useEthers, useTokenBalance } from '@usedapp/core';
import useGasInfo from '@/hooks/gas/useGasInfo';
import useSignMessage from '@/hooks/useSignMessage';
import { useOpenModal } from '@/state/application/hooks';
import { ApplicationModal } from '@/state/application/actions';
import { getSubAccount, unbindSubAccount } from '@/utils/axios';
import { formatEther } from 'ethers/lib/utils';

export default function GasManager() {
  const { account, library } = useEthers()
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [manageAddressOpen, setManageAddressOpen] = useState(false);
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [bnbBalance, setBnbBalance] = useState<string>('0');
  const { sponsorRecords, addressList, gasPrice, depositRecords, withdrawRecords, userBalance, signatureStatus, loadSponsorRecords, loadDepositRecords, loadWithdrawRecords, loadUserBalance, loadSubAccount, retrySignature, addSubAccount, editGasTip, removeSomeSubAccount, removeAllSubAccount, depositBnb, depositState, withdrawBnb, withdrawState, getLoginSign } = useGasInfo();
  const { signMessage } = useSignMessage();
  const openwallet = useOpenModal(ApplicationModal.WALLET)
  
  // 获取用户 BNB 余额
  useEffect(() => {
    const getBnbBalance = async () => {
      if (account && library) {
        try {
          const balance = await library.getBalance(account);
          setBnbBalance(balance.toString());
        } catch (error) {
          console.error('Error getting BNB balance:', error);
        }
      }
    };
    
    getBnbBalance();
  }, [account, library]);
  const recordColumns = [
    { title: '时间', dataIndex: 'time', key: 'time', align: 'left' as const },
    { title: '地址', dataIndex: 'address', key: 'address', align: 'left' as const },
    { title: '数量', dataIndex: 'amount', key: 'amount', align: 'left' as const },
  ];

  const transactionColumns = [
    { 
      title: '时间', 
      dataIndex: 'time', 
      key: 'time', 
      align: 'left' as const,
      render: (text: string) => <span className="text-sm text-gray-600">{text}</span>
    },
    { 
      title: '地址', 
      dataIndex: 'address', 
      key: 'address', 
      align: 'left' as const,
      render: (text: string) => <span className="font-mono text-sm text-blue-600">{text}</span>
    },
    { 
      title: '数量', 
      dataIndex: 'amount', 
      key: 'amount', 
      align: 'left' as const,
      render: (text: string) => <span className="font-medium text-green-600">{text}</span>
    },
    { 
      title: '交易哈希', 
      dataIndex: 'txHash', 
      key: 'txHash', 
      align: 'left' as const,
      render: (text: string) => (
        <a 
          href={`https://bscscan.com/tx/${text}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline text-sm break-all"
        >
          {text ? `${text.slice(0, 10)}...${text.slice(-8)}` : '--'}
        </a>
      )
    },
  ];
  const depositWithdrawColumns = [
    { 
      title: '地址', 
      dataIndex: 'address', 
      key: 'address', 
      align: 'left' as const,
      render: (text: string) => <span className="font-mono text-sm text-blue-600">{text}</span>
    },
    { 
      title: '数量', 
      dataIndex: 'amount', 
      key: 'amount', 
      align: 'left' as const,
      render: (text: string) => <span className="font-medium text-green-600">{text}</span>
    },
    { 
      title: '交易哈希', 
      dataIndex: 'txHash', 
      key: 'txHash', 
      align: 'left' as const,
      render: (text: string) => (
        <a 
          href={`https://bscscan.com/tx/${text}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline text-sm break-all"
        >
          {text ? `${text.slice(0, 10)}...${text.slice(-8)}` : '--'}
        </a>
      )
    },
  ];
  const [mainTab, setMainTab] = useState<'address' | 'recharge' | 'consume' | 'withdraw' | 'deposit' | 'withdraw'>('address');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const fetchData = async (account: string) => {
      const sign = await getLoginSign(account)
      if (!sign) return
      loadDepositRecords(account)
      loadWithdrawRecords(account)
      await loadSubAccount(account)
      await loadSponsorRecords(account)
      await loadUserBalance(account)
    }
    if (account) {
      fetchData(account)
    }
    
  }, [account])

  const handleEdit = () => setEditModalOpen(true);
  const handleEditSave = (value: string) => {
    // setGasPrice(Number(value));
    setEditModalOpen(false);
  };

  const handleDelete = async(addresses: any[]) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const addressLow = addresses.map(item => item.toLowerCase())
    const msg = `i authorize master account ${account?.toLowerCase()} to stop paying gas fees for sub-accounts ${addressLow.join(',')}, at unix timestamp ${timestamp}`;
    try {
      const res = await removeSomeSubAccount(account as string, addressLow)
      if (res.status === 200) {
        message.success('已移除子账户');
        loadSubAccount(account);
      } else {
        message.error(res.data.message || '移除失败');
      }
      message.success('已移除子账户');
    } catch (e: any) {
      message.error(e?.message || '签名失败');
    }
  };

  const handleRemoveAll = async () => {
    if (!account) return;
    try {
      const res = await removeAllSubAccount(account)
      if (res && res.status === 200) {
        message.success('已移除全部子账户');
        loadSubAccount(account);
        setSelectedRowKeys([])
      } else {
        message.error(res.data.message || '移除失败');
      }
    } catch (e: any) {
      message.error(e?.message);
    }
  };

  const handleBatchDelete = async () => {
    if (!account) return;
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的子账户');
      return;
    }
    const addresses = selectedRowKeys.map(key => key.toString())
    const res = await removeSomeSubAccount(account, addresses)
    if (res.status === 200) {
      message.success('已批量删除选中子账户');
      loadSubAccount(account)
      setSelectedRowKeys([]);
    } else {
      message.error(res.data.message || '删除失败');
    }
  };

  const handleAddSubAccount = async (addresses: string[]) => {
    if (!account) return;
    const res = await addSubAccount(account, addresses)
    console.log(res, 'handleAddSubAccount res')
    if (res.status === 200) {
      message.success('已添加子账户');
      loadSubAccount(account)
      setManageAddressOpen(false)
    } else {
      message.error(res.data.message || '添加失败');
    }
  }

  const handleEditGasTip = async (value: string) => {
    if (!account) return;
    const res = await editGasTip(account, Number(value))
    if (res && res.status === 200) {
      message.success('已设置 Gas Price');
      loadSubAccount(account)
      setEditModalOpen(false)
    } else {
      message.error(res.data.message || '设置失败');
    }
  }

  const handleRecharge = async (amount: string) => {
    if (!account) return;
    try {
      await depositBnb(amount);
      setRechargeOpen(false);
      message.success('充值交易已发送');
      // 刷新充值记录列表
      loadDepositRecords(account);
    } catch (error: any) {
      message.error(error?.message || '充值失败');
    }
  }

  const handleWithdraw = async (amount: string) => {
    if (!account) return;
    try {
      await withdrawBnb(amount);
      setWithdrawOpen(false);
      message.success('提现交易已发送');
      // 刷新提现记录列表
      loadWithdrawRecords(account);
    } catch (error: any) {
      message.error(error?.message || '提现失败');
    }
  }

  const columns = [
    {
      title: '时间',
      dataIndex: 'add_time',
      key: 'add_time',
      align: 'left' as const,
      render: (text: string) => <span className="font-mono text-gray-700">{new Date(Number(text) * 1000).toLocaleString()}</span>,
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
        <Popconfirm title="确定删除该地址吗？" onConfirm={() => handleDelete([record.address])} okText="删除" cancelText="取消" disabled={!account}>
          <Button type="link" size="small" className="text-yellow-500" disabled={!account}>删除</Button>
        </Popconfirm>
      ),
    },
  ];
  // rowSelection object indicates the need for row selection
const rowSelection: TableProps<any>['rowSelection'] = {
  onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
    console.log(newSelectedRowKeys, 'newSelectedRowKeys')
    setSelectedRowKeys(newSelectedRowKeys);
  },
  getCheckboxProps: (record: any) => ({
    name: record.address,
  }),
};
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center bg-blue-50 rounded-xl px-6 py-6 shadow">
              <div className="text-3xl font-extrabold text-primary mb-1">{account ? addressList.length : '--'}</div>
              <div className="text-gray-600 mb-2 text-sm">绑定地址数量</div>
              <Button className="px-4 py-1 rounded-lg font-bold shadow transition text-sm" onClick={() => setManageAddressOpen(true)} disabled={!account}>绑定地址</Button>
            </div>
            <div className="flex flex-col items-center bg-gray-50 rounded-xl px-6 py-6 shadow">
              <div className="text-3xl font-extrabold mb-1 text-primary">{account ? `${gasPrice} gwei` : '--'}</div>
              <div className="text-gray-600 mb-2 text-sm">Gas Price</div>
              <Button onClick={handleEdit} className="px-4 py-1 rounded-lg font-bold shadow transition text-sm" disabled={!account}>编辑</Button>
            </div>
            <div className="flex flex-col items-center bg-green-50 rounded-xl px-6 py-6 shadow">
              <div className="text-3xl font-extrabold text-primary mb-1">
                {account && userBalance !== '0' ? userBalance : '--'} 
                <span className="text-sm font-normal">BNB</span>
              </div>
              <div className="text-gray-600 mb-2 text-sm">合约余额</div>
              <div className="flex gap-2">
                <Button className="px-3 py-1 rounded-lg font-bold shadow transition text-xs" onClick={() => setRechargeOpen(true)} disabled={!account}>充值</Button>
                <Button className="px-3 py-1 rounded-lg font-bold shadow transition text-xs" onClick={() => setWithdrawOpen(true)} disabled={!account}>提现</Button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow border border-[#e0e0e0] p-6">
            <Tabs activeKey={mainTab} onChange={key => setMainTab(key as 'address' | 'recharge' | 'consume' | 'withdraw' | 'deposit' | 'withdraw')}>
              <Tabs.TabPane tab="地址列表" key="address">
                {signatureStatus === false && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-yellow-800">
                        <div className="font-medium">需要签名才能获取信息</div>
                        <div className="text-sm">请点击下方按钮进行签名以获取地址列表信息</div>
                      </div>
                      <Button
                        type="primary"
                        onClick={() => account && retrySignature(account)}
                        className="bg-yellow-600 hover:bg-yellow-700 border-yellow-600"
                      >
                        重新签名
                      </Button>
                    </div>
                  </div>
                )}
                {signatureStatus !== false && (
                  <>
                    <div className="mb-3 flex items-center justify-end gap-2">
                      <Button
                        className="px-4 py-2 rounded-lg shadow transition text-base text-primary bg-white"
                        onClick={handleRemoveAll}
                        disabled={!account}
                      >
                        移除全部子账户
                      </Button>
                      <Button
                        className="px-4 py-2 rounded-lg shadow transition text-base text-primary bg-white"
                        onClick={handleBatchDelete}
                        disabled={!account || selectedRowKeys.length === 0}
                      >
                        批量删除
                      </Button>
                    </div>
                    <div className="overflow-x-auto rounded-xl shadow border border-[#e0e0e0] bg-white">
                      <Table
                        rowSelection={{ ...rowSelection }}
                        columns={columns}
                        dataSource={addressList}
                        pagination={false}
                        bordered
                        rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                        className="custom-ant-table"
                        rowKey="address"
                      />
                    </div>
                  </>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="消费列表" key="recharge">
                {signatureStatus === false && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-yellow-800">
                        <div className="font-medium">需要签名才能获取信息</div>
                        <div className="text-sm">请点击下方按钮进行签名以获取充值记录信息</div>
                      </div>
                      <Button
                        type="primary"
                        onClick={() => account && retrySignature(account)}
                        className="bg-yellow-600 hover:bg-yellow-700 border-yellow-600"
                      >
                        重新签名
                      </Button>
                    </div>
                  </div>
                )}
                {signatureStatus !== false && (
                  <Table
                    columns={recordColumns}
                    dataSource={sponsorRecords?.map((item, idx) => ({ ...item, key: idx })) || []}
                    pagination={false}
                    size="small"
                    bordered
                    rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                    className="custom-ant-table"
                  />
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="充值记录" key="deposit">
                <Table
                  columns={depositWithdrawColumns}
                  dataSource={depositRecords?.map((item, idx) => ({ ...item, key: idx })) || []}
                  pagination={false}
                  size="small"
                  bordered
                  rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                  className="custom-ant-table"
                  locale={{
                    emptyText: <div className="text-gray-500 py-8 text-center">暂无记录</div>
                  }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="提现记录" key="withdraw">
                <Table
                  columns={depositWithdrawColumns}
                  dataSource={withdrawRecords?.map((item, idx) => ({ ...item, key: idx })) || []}
                  pagination={false}
                  size="small"
                  bordered
                  rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                  className="custom-ant-table"
                  locale={{
                    emptyText: <div className="text-gray-500 py-8 text-center">暂无记录</div>
                  }}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <EditGasModal
        open={editModalOpen}
        initialValue={gasPrice.toString()}
        onOk={handleEditGasTip}
        onCancel={() => setEditModalOpen(false)}
      />
      <AddAddressModal
        open={manageAddressOpen}
        onOk={handleAddSubAccount}
        onCancel={() => setManageAddressOpen(false)}
      />
      <RechargeModal
        open={rechargeOpen}
        onOk={handleRecharge}
        onCancel={() => setRechargeOpen(false)}
        loading={!['None', 'Success'].includes(depositState.status)}
        bnbBalance={bnbBalance}
      />
      <WithdrawModal
        open={withdrawOpen}
        onOk={handleWithdraw}
        onCancel={() => setWithdrawOpen(false)}
        loading={!['None', 'Success'].includes(withdrawState.status)}
        userBalance={userBalance}
      />
    </div>
  );
} 