import { useCallback, useEffect, useState } from 'react'
import { useContractFunction, useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import useSignMessage from '../useSignMessage';
import { getSubAccount, getSponsorRecords, bindSubAccount, editGasPrice, unbindSubAccount } from '@/utils/axios';
import { useGasInfoContract, useGasInfoContractReadonly, useGasInfoContractReadonlyNew } from '../useContract';

export default function useGasInfo() {
  const { signMessage } = useSignMessage();
  const { account } = useEthers();
  const gasInfoContract = useGasInfoContract();
  const gasInfoContractReadonly = useGasInfoContractReadonly();
  const gasInfoContractReadonlyNew = useGasInfoContractReadonlyNew();
  const [depositRecords, setDepositRecords] = useState<any[] | undefined>(undefined)
  const [withdrawRecords, setWithdrawRecords] = useState<any[] | undefined>(undefined)
  const [loadingDepositRecords, setLoadingDepositRecords] = useState<boolean>(false)
  const [loadingWithdrawRecords, setLoadingWithdrawRecords] = useState<boolean>(false)
  const [sponsorRecords, setSponsorRecords] = useState<any[] | undefined>(undefined)
  const [addressList, setAddressList] = useState<any[]>([])
  const [gasPrice, setGasPrice] = useState<number>(0)
  const [userBalance, setUserBalance] = useState<string>('0')
  const [signatureStatus, setSignatureStatus] = useState<boolean | null>(null)
  
  // 获取合约的 deposit 函数
  const { send: deposit, state: depositState } = useContractFunction(gasInfoContract, 'deposit', {
    transactionName: 'Deposit BNB',
  })

  // 获取合约的 withdraw 函数
  const { send: withdraw, state: withdrawState } = useContractFunction(gasInfoContract, 'withdraw', {
    transactionName: 'Withdraw BNB',
  })
  console.log(depositState, 'depositState')
  console.log(withdrawState, 'withdrawState')
  const loadDepositRecords = async (account: string) => {
    if (!account || !gasInfoContractReadonly) return;
    
    // setDepositRecords(undefined)
    try {
      // 查询 Deposit 事件日志
      setLoadingDepositRecords(true)
      const depositFilter = gasInfoContractReadonly.filters.Deposit(account, null);
      const depositEvents = await gasInfoContractReadonly.queryFilter(depositFilter);
      
      const records = depositEvents.map(event => ({
        address: event.args?.user || '',
        amount: ethers.utils.formatEther(event.args?.amount || 0) + ' BNB',
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      }));
      console.log(records, 'records')
      setDepositRecords(records);
      setLoadingDepositRecords(false)
    } catch (error) {
      console.error('Error loading deposit records:', error);
      setDepositRecords([]);
    }
  }

  const loadWithdrawRecords = async (account: string) => {
    if (!account || !gasInfoContractReadonly) return;
    
    // setWithdrawRecords(undefined)
    try {
      // 查询 Withdrawal 事件日志
      setLoadingWithdrawRecords(true)
      const withdrawFilter = gasInfoContractReadonly.filters.Withdrawal(account, null);
      const withdrawEvents = await gasInfoContractReadonly.queryFilter(withdrawFilter);
      console.log(withdrawEvents, 'withdrawEvents')
      
      const records = withdrawEvents.map(event => ({
        address: event.args?.user || '',
        amount: ethers.utils.formatEther(event.args?.amount || 0) + ' BNB',
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      }));
      
      setWithdrawRecords(records);
      setLoadingWithdrawRecords(false)
    } catch (error) {
      console.error('Error loading withdraw records:', error);
      setWithdrawRecords([]);
    }
  }

  // 查询用户在 gasInfo 合约中的余额
  const loadUserBalance = async (address: string) => {
    if (!address || !gasInfoContractReadonlyNew) return;
    
    try {
      // 调用合约的 balanceOf 函数
      const balance = await gasInfoContractReadonlyNew.balanceOf(address);
      const balanceInEther = ethers.utils.formatEther(balance);
      setUserBalance(balanceInEther);
      return balanceInEther;
    } catch (error) {
      console.error('Error loading user balance:', error);
      setUserBalance('0');
      return '0';
    }
  }
  const loadSponsorRecords = async (account: string) => {
    setSponsorRecords(undefined)
    const sign = await getLoginSign(account)
    if (!sign) return
    const res = await getSponsorRecords({
      account: account?.toLowerCase(),
      sign,
      timestamp: Math.floor(Date.now() / 1000),
    })
    console.log(res, 'loadSponsorRecords res')
    if (res.status === 200) {
      setSponsorRecords(res.data || [])
    }
  }

  const getLoginSign = async (account: string) => {
    let sign = ''
    const msg = `48club portal login: account=${account.toLowerCase()}`;
    if (sessionStorage.getItem(account)) {
      setSignatureStatus(true);
      return sessionStorage.getItem(account)
    }
    try {
      sign = await signMessage(msg);
      sessionStorage.setItem(account, sign);
      setSignatureStatus(true);
    } catch (e) {
      setSignatureStatus(false);
      return null
    }
    
    return sign
  }

  const loadSubAccount = async (account: string) => {
    const sign = await getLoginSign(account)
    if (!sign) return
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await getSubAccount({
      account: account?.toLowerCase(),
      sign,
      timestamp,
    })
    console.log(res, 'loadSubAccount res')
    if (res.status === 200) {
      setAddressList(res.data.sub_accounts || [])
      // 将 wei 转换为 gwei (1 gwei = 10^9 wei)
      const gasPriceInGwei = res.data.gas_tip / 1e9
      setGasPrice(gasPriceInGwei)
    }
    console.log(res, 'res')
  }

  // 重新签名并获取信息
  const retrySignature = async (account: string) => {
    // 清除之前的签名
    sessionStorage.removeItem(account);
    setSignatureStatus(null);
    const sign = await getLoginSign(account)
    if (!sign) return
    setSignatureStatus(true)
    // 重新获取签名和信息
    loadDepositRecords(account)
    loadWithdrawRecords(account)
    await loadSubAccount(account);
    await loadSponsorRecords(account);
  }
  const addSubAccount = async (account: string, addresses: string[]) => {
    // 拼接签名消息
    const timestamp = Math.floor(Date.now() / 1000);
    const msg = `i authorize master account ${account.toLowerCase()} to pay all gas fees incurred by transactions from sub-accounts ${addresses.join(',')}, at unix timestamp ${timestamp}`;
    const sign = await signMessage(msg);
    const res = await bindSubAccount({
      sign,
      timestamp,
      accounts: [account.toLowerCase(), ...addresses],
    })
    console.log(res, 'addSubAccount res')
    return res
  }
  const editGasTip = async (account: string, gasPrice: number) => {
    const timestamp = Math.floor(Date.now() / 1000);
    // 将 gwei 转换为 wei 用于签名消息
    const gasPriceInWei = Math.floor(gasPrice * 1e9)
    const msg = `i authorize master account ${account.toLowerCase()} to set gas tip to ${gasPriceInWei} wei, at unix timestamp ${timestamp}`;
    const sign = await signMessage(msg);
    const res = await editGasPrice({
      account: account?.toLowerCase(),
      sign,
      timestamp,
      set_tip: gasPriceInWei,
    })
    return res
  }
  const removeAllSubAccount = async (account: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const msg = `i authorize master account ${account.toLowerCase()} to stop paying gas fees for all sub-accounts, at unix timestamp ${timestamp}`;
    let res = null
    try {
      const sign = await signMessage(msg);
      res = await unbindSubAccount({
        accounts: [account],
        sign,
        timestamp,
      })
      setAddressList([]);
      // message.success('已移除全部子账户');
    } catch (e: any) {
      // message.error(e?.message || '签名失败');

    }
    return res
  }
  const removeSomeSubAccount = async (account: string, addresses: string[]) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const addressLow = addresses.map(item => item.toLowerCase())
    const msg = `i authorize master account ${account?.toLowerCase()} to stop paying gas fees for sub-accounts ${addressLow.join(',')}, at unix timestamp ${timestamp}`;
    const sign = await signMessage(msg);
    const res = await unbindSubAccount({
      accounts: [account, ...addresses],
      sign,
      timestamp,
    })
    return res
  }

  // 充值 BNB 到 gasInfo 合约
  const depositBnb = useCallback(async (amount: string) => {
    if (!account || !gasInfoContract) {
      throw new Error('Account or contract not available');
    }
    
    try {
      // 验证输入金额
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Invalid amount');
      }
      
      // 将 BNB 数量转换为 wei
      const amountInWei = ethers.utils.parseEther(amount);
      
      // 调用合约的 deposit 函数，发送 BNB
      await deposit({
        value: amountInWei
      });
      
      console.log('Deposit transaction sent:', amount, 'BNB');
    } catch (error) {
      console.error('Error depositing BNB:', error);
      throw error;
    }
  }, [account, gasInfoContract, deposit])

  // 提现 BNB 从 gasInfo 合约
  const withdrawBnb = useCallback(async (amount: string) => {
    if (!account || !gasInfoContract) {
      throw new Error('Account or contract not available');
    }
    
    try {
      // 验证输入金额
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Invalid amount');
      }
      
      // 将 BNB 数量转换为 wei
      const amountInWei = ethers.utils.parseEther(amount);
      
      // 调用合约的 withdraw 函数
      await withdraw(amountInWei);
      
      console.log('Withdraw transaction sent:', amount, 'BNB');
    } catch (error) {
      console.error('Error withdrawing BNB:', error);
      throw error;
    }
  }, [account, gasInfoContract, withdraw])

  // 监听 deposit 交易状态
  useEffect(() => {
    console.log(depositState, 'depositState')
    if (depositState.status === 'Success') {
      console.log('Deposit transaction successful');
      // 交易成功后刷新合约余额和充值记录
      if (account) {
        loadUserBalance(account);
        loadDepositRecords(account);
      }
    } else if (depositState.status === 'Exception' || depositState.status === 'Fail') {
      console.error('Deposit transaction failed:', depositState.errorMessage);
    }
  }, [depositState.status, depositState.errorMessage, account])

  // 监听 withdraw 交易状态
  useEffect(() => {
    if (withdrawState.status === 'Success') {
      console.log('Withdraw transaction successful');
      // 交易成功后刷新合约余额和提现记录
      if (account) {
        loadUserBalance(account);
        loadWithdrawRecords(account);
      }
    } else if (withdrawState.status === 'Exception' || withdrawState.status === 'Fail') {
      console.error('Withdraw transaction failed:', withdrawState.errorMessage);
    }
  }, [withdrawState.status, withdrawState.errorMessage, account])
  const clearList = () => {
    setDepositRecords([])
    setWithdrawRecords([])
    setSponsorRecords([])
    setAddressList([])
    setGasPrice(0)
    setUserBalance('0')
    setSignatureStatus(null)
  }
  return {
    sponsorRecords,
    addressList,
    gasPrice,
    depositRecords,
    withdrawRecords,
    userBalance,
    signatureStatus,
    loadSponsorRecords,
    loadDepositRecords,
    loadWithdrawRecords,
    loadUserBalance,
    getLoginSign,
    loadSubAccount,
    retrySignature,
    addSubAccount,
    editGasTip,
    removeSomeSubAccount,
    removeAllSubAccount,
    depositBnb,
    depositState,
    withdrawBnb,
    withdrawState,
    loadingDepositRecords,
    loadingWithdrawRecords,
    clearList,
    setSignatureStatus,
  }
}
