import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Tabs, TableProps } from 'antd';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { account, library } = useEthers()
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [manageAddressOpen, setManageAddressOpen] = useState(false);
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [bnbBalance, setBnbBalance] = useState<string>('0');
  const { sponsorRecords, addressList, gasPrice, depositRecords, withdrawRecords, userBalance, signatureStatus, loadSponsorRecords, loadDepositRecords, loadWithdrawRecords, loadUserBalance, loadSubAccount, retrySignature, addSubAccount, editGasTip, removeSomeSubAccount, removeAllSubAccount, depositBnb, depositState, withdrawBnb, withdrawState } = useGasInfo();
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
    { title: t('gas.time'), dataIndex: 'time', key: 'time', align: 'left' as const },
    { title: t('gas.address'), dataIndex: 'address', key: 'address', align: 'left' as const },
    { title: t('gas.amount'), dataIndex: 'amount', key: 'amount', align: 'left' as const },
  ];

  const transactionColumns = [
    { 
      title: t('gas.time'), 
      dataIndex: 'time', 
      key: 'time', 
      align: 'left' as const,
      render: (text: string) => <span className="text-sm text-gray-600">{text}</span>
    },
    { 
      title: t('gas.address'), 
      dataIndex: 'address', 
      key: 'address', 
      align: 'left' as const,
      render: (text: string) => <span className="font-mono text-sm text-blue-600">{text}</span>
    },
    { 
      title: t('gas.amount'), 
      dataIndex: 'amount', 
      key: 'amount', 
      align: 'left' as const,
      render: (text: string) => <span className="font-medium text-green-600">{text}</span>
    },
    { 
      title: t('gas.transaction_hash'), 
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
      title: t('gas.address'), 
      dataIndex: 'address', 
      key: 'address', 
      align: 'left' as const,
      render: (text: string) => <span className="font-mono text-sm text-blue-600">{text}</span>
    },
    { 
      title: t('gas.amount'), 
      dataIndex: 'amount', 
      key: 'amount', 
      align: 'left' as const,
      render: (text: string) => <span className="font-medium text-green-600">{text}</span>
    },
    { 
      title: t('gas.transaction_hash'), 
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
      const sign = await signMessage(msg);
      const res = await unbindSubAccount({
        accounts: [account, ...addresses],
        sign,
        timestamp,
      })
      message.success(t('gas.subaccount_removed'));
      // 重新获取子账户列表
      if (account) {
        loadSubAccount(account);
      }
    } catch (e: any) {
      message.error(e?.message || t('gas.signature_failed'));
    }
  };

  const handleRemoveAll = async () => {
    if (!account) return;
    try {
      const res = await removeAllSubAccount(account)
      if (res && res.status === 200) {
        message.success(t('gas.remove_all_success'));
        loadSubAccount(account);
      } else {
        message.error(res?.data?.message || t('gas.remove_failed'));
      }
    } catch (e: any) {
      message.error(e?.message);
    }
  };

  const handleBatchDelete = async () => {
    if (!account) return;
    if (selectedRowKeys.length === 0) {
      message.warning(t('gas.select_subaccounts'));
      return;
    }
    console.log(selectedRowKeys, 'selectedRowKeys')
    const addresses = selectedRowKeys.map(key => key.toString())
    const res = await removeSomeSubAccount(account, addresses)
    if (res.status === 200) {
      message.success(t('gas.batch_delete_success'));
      loadSubAccount(account)
    } else {
      message.error(res.data.message || t('gas.delete_failed'));
    }
    setSelectedRowKeys([]);
    message.success(t('gas.batch_delete_success'));
    // 重新获取子账户列表
    if (account) {
      loadSubAccount(account);
    }
  };

  const handleAddSubAccount = async (addresses: string[]) => {
    if (!account) return;
    const res = await addSubAccount(account, addresses)
    console.log(res, 'handleAddSubAccount res')
    if (res.status === 200) {
      message.success(t('gas.subaccount_added'));
      loadSubAccount(account)
    } else {
      message.error(res.data.message || t('gas.add_failed'));
    }
    setManageAddressOpen(false)
  }

  const handleEditGasTip = async (value: string) => {
    if (!account) return;
    const res = await editGasTip(account, Number(value))
    if (res && res.status === 200) {
      message.success(t('gas.gas_price_set'));
      loadSubAccount(account)
    } else {
      message.error(res?.data?.message || t('gas.set_failed'));
    }
    setEditModalOpen(false)
  }

  const handleRecharge = async (amount: string) => {
    if (!account) return;
    try {
      await depositBnb(amount);
      setRechargeOpen(false);
      message.success(t('gas.recharge_success'));
      // 刷新充值记录列表
      if (account) {
        loadDepositRecords(account);
      }
    } catch (error: any) {
      message.error(error?.message || t('gas.recharge_failed'));
    }
  }

  const handleWithdraw = async (amount: string) => {
    if (!account) return;
    try {
      await withdrawBnb(amount);
      setWithdrawOpen(false);
      message.success(t('gas.withdraw_success'));
      // 刷新提现记录列表
      if (account) {
        loadWithdrawRecords(account);
      }
    } catch (error: any) {
      message.error(error?.message || t('gas.withdraw_failed'));
    }
  }

  const columns = [
    {
      title: t('gas.time'),
      dataIndex: 'add_time',
      key: 'add_time',
      align: 'left' as const,
      render: (text: string) => <span className="font-mono text-gray-700">{new Date(Number(text) * 1000).toLocaleString()}</span>,
    },
    {
      title: t('gas.address'),
      dataIndex: 'address',
      key: 'address',
      align: 'left' as const,
      render: (text: string) => <span className="font-mono text-blue-700">{text}</span>,
    },
    {
      title: t('gas.operation'),
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Popconfirm title={t('gas.confirm_delete_address')} onConfirm={() => handleDelete([record.address])} okText={t('gas.ok')} cancelText={t('gas.cancel')} disabled={!account}>
          <Button type="link" size="small" className="text-yellow-500" disabled={!account}>{t('gas.delete')}</Button>
        </Popconfirm>
      ),
    },
  ];
  // rowSelection object indicates the need for row selection
const rowSelection: TableProps<any>['rowSelection'] = {
  selectedRowKeys,
  onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
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
          <div className="text-center text-3xl font-extrabold tracking-wide mb-2">{t('gas.title')}</div>
          <div className="flex justify-center mb-4 items-center gap-2">
            <span className="text-gray-600 mr-2">{t('gas.your_address')}</span>
            <span className="font-mono text-blue-700 bg-blue-50 rounded px-2 py-1 text-base">{account}</span>
            {!account && (
              <Button
                className="ml-4 px-4 py-1 bg-primary text-white rounded font-bold shadow transition"
                onClick={openwallet}
              >
                {t('gas.connect_wallet')}
              </Button>
            )}
          </div>
          <div className="text-center text-base text-gray-500 mb-8">{t('gas.subtitle')}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center bg-blue-50 rounded-xl px-6 py-6 shadow">
              <div className="text-3xl font-extrabold text-primary mb-1">{account ? addressList.length : '--'}</div>
              <div className="text-gray-600 mb-2 text-sm">{t('gas.bound_address_count')}</div>
              <Button className="px-4 py-1 rounded-lg font-bold shadow transition text-sm" onClick={() => setManageAddressOpen(true)} disabled={!account}>{t('gas.bind_address')}</Button>
            </div>
            <div className="flex flex-col items-center bg-gray-50 rounded-xl px-6 py-6 shadow">
              <div className="text-3xl font-extrabold mb-1 text-primary">{account ? `${gasPrice} gwei` : '--'}</div>
              <div className="text-gray-600 mb-2 text-sm">{t('gas.gas_price')}</div>
              <Button onClick={handleEdit} className="px-4 py-1 rounded-lg font-bold shadow transition text-sm" disabled={!account}>{t('gas.edit')}</Button>
            </div>
            <div className="flex flex-col items-center bg-green-50 rounded-xl px-6 py-6 shadow">
              <div className="text-3xl font-extrabold text-primary mb-1">
                {account && userBalance !== '0' ? userBalance : '--'} 
                <span className="text-sm font-normal">BNB</span>
              </div>
              <div className="text-gray-600 mb-2 text-sm">{t('gas.contract_balance')}</div>
              <div className="flex gap-2">
                <Button className="px-3 py-1 rounded-lg font-bold shadow transition text-xs" onClick={() => setRechargeOpen(true)} disabled={!account}>{t('gas.recharge')}</Button>
                <Button className="px-3 py-1 rounded-lg font-bold shadow transition text-xs" onClick={() => setWithdrawOpen(true)} disabled={!account}>{t('gas.withdraw')}</Button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow border border-[#e0e0e0] p-6">
            <Tabs activeKey={mainTab} onChange={key => setMainTab(key as 'address' | 'recharge' | 'consume' | 'withdraw' | 'deposit' | 'withdraw')}>
              <Tabs.TabPane tab={t('gas.address_list')} key="address">
                {signatureStatus === false && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-yellow-800">
                        <div className="font-medium">{t('gas.need_signature')}</div>
                        <div className="text-sm">{t('gas.signature_description')}</div>
                      </div>
                      <Button
                        type="primary"
                        onClick={() => account && retrySignature(account)}
                        className="bg-yellow-600 hover:bg-yellow-700 border-yellow-600"
                      >
                        {t('gas.retry_signature')}
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
                        {t('gas.remove_all_subaccounts')}
                      </Button>
                      <Button
                        className="px-4 py-2 rounded-lg shadow transition text-base text-primary bg-white"
                        onClick={handleBatchDelete}
                        disabled={!account || selectedRowKeys.length === 0}
                      >
                        {t('gas.batch_delete')}
                      </Button>
                    </div>
                    <div className="overflow-x-auto rounded-xl shadow border border-[#e0e0e0] bg-white">
                      <Table
                        rowSelection={{ ...rowSelection }}
                        columns={columns}
                        dataSource={addressList.map((item, idx) => ({ ...item, key: item.address || idx }))}
                        pagination={false}
                        bordered
                        rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                        className="custom-ant-table"
                      />
                    </div>
                  </>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab={t('gas.consume_list')} key="recharge">
                {signatureStatus === false && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-yellow-800">
                        <div className="font-medium">{t('gas.need_signature')}</div>
                        <div className="text-sm">{t('gas.signature_description_recharge')}</div>
                      </div>
                      <Button
                        type="primary"
                        onClick={() => account && retrySignature(account)}
                        className="bg-yellow-600 hover:bg-yellow-700 border-yellow-600"
                      >
                        {t('gas.retry_signature')}
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
              <Tabs.TabPane tab={t('gas.recharge_records')} key="deposit">
                <Table
                  columns={depositWithdrawColumns}
                  dataSource={depositRecords?.map((item, idx) => ({ ...item, key: idx })) || []}
                  pagination={false}
                  size="small"
                  bordered
                  rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                  className="custom-ant-table"
                  locale={{
                    emptyText: <div className="text-gray-500 py-8 text-center">{t('gas.no_records')}</div>
                  }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={t('gas.withdraw_records')} key="withdraw">
                <Table
                  columns={depositWithdrawColumns}
                  dataSource={withdrawRecords?.map((item, idx) => ({ ...item, key: idx })) || []}
                  pagination={false}
                  size="small"
                  bordered
                  rowClassName={(_, idx) => idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                  className="custom-ant-table"
                  locale={{
                    emptyText: <div className="text-gray-500 py-8 text-center">{t('gas.no_records')}</div>
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
