import inscriptionsApi from '@/utils/request'
import type { TableColumnsType } from 'antd'
import { Button, Radio, Table, message } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { decimalsToStr } from '@/utils'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { useEthers, useSendTransaction, useTokenBalance } from '@usedapp/core'
import * as utils from 'web3-utils'
import { useWrappedContract } from '@/hooks/useContract'
import { useWrapAcitons } from '../inscriptions/hooks'
import { wrappedAddress, wrappedToken } from '@/constants/contracts'
import { BN, fromWei } from '@/utils/bn'
interface DataType {
  key: React.Key
  tick_hash: string
  to: string
  tx_hash: string
  type: string
  update_at: string
  amt: string
}

enum FANSTYPE {
  fanstobfans = 1,
  bfanstobfan = 2,
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'to',
    dataIndex: 'to',
    width: 100,
  },
  {
    title: 'amt',
    dataIndex: 'amt',
    width: 100,
    render: (_: any) => {
      return decimalsToStr(_, 8)
    },
  },
  {
    title: 'create_at',
    dataIndex: 'update_at',
    width: 100,
    render: (value: any) => {
      return value ? moment(value * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
  },
]
const tickHash = '0xd893ca77b3122cb6c480da7f8a12cb82e19542076f5895f21446258dc473a7c2' // fans
const App = () => {
  const { account, chainId } = useEthers()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [menuType, setMenuType] = useState<FANSTYPE>(FANSTYPE.bfanstobfan)
  const [loadinglist, setLoadingList] = useState(false)
  const [warpList, setwarpList] = useState<any[]>([])
  const [userBlance, setResult] = useState<any | undefined>()

  const { onMultisend, onbfanstofans, multisendLoading, BfansToFansLoading } = useWrapAcitons()

  const getData = () => {
    setLoadingList(true)
    inscriptionsApi
      .getwrap_unwrapList({ type: menuType })
      .then((data) => {
        if (data.code == 0) {
          setwarpList(
            data.data.list.map((item, index) => {
              return {
                ...item,
                key: index,
              }
            })
          )
        }
      })
      .finally(() => {
        setLoadingList(false)
      })
  }

  useEffect(() => {
    getData()
    getBlances()
  }, [menuType, account])

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const getBlances = useCallback(() => {
    if (!account) return
    inscriptionsApi
      .getUserBalances({
        address: account,
        tick_hash: [tickHash],
      })
      .then((res) => {
        if (res.code === 0) {
          const walletList = res.data.wallet
            .map((item) => {
              return {
                ...item,
                amount: decimalsToStr(item.balance, item?.decimals),
              }
            })
            .filter((amount) => amount.tick_hash.toLocaleLowerCase() === tickHash.toLocaleLowerCase())
          if (walletList.length <= 0) return
          setResult(walletList[0].balance)
        }
      })
  }, [account])

  const bfansAmounts = useTokenBalance(wrappedToken, wrappedAddress)

  const bfanstr = useMemo(() => {
    if (!bfansAmounts) return 0
    return bfansAmounts.toNumber()
  }, [bfansAmounts])

  const selectedTotalAmount = useMemo(() => {
    if (selectedRowKeys.length <= 0) return 0
    const data = selectedRowKeys.reduce((acc: any, key) => {
      const list = warpList[key]
      if (!list) return acc
      acc = acc.plus(list?.amt || 0)
      return acc
    }, BN(0))
    return data?.toNumber() || 0
  }, [selectedRowKeys, warpList])
  const hasSelected = selectedRowKeys.length > 0

  const fanstobfans = async () => {
    const { address, value, ids, total } = selectedRowKeys.reduce(
      (
        acc: {
          address: string[]
          value: string[]
          ids: string[]
          total: BigNumber
        },
        key
      ) => {
        const list = warpList[key]
        acc.address.push(list.to)
        acc.value.push(list.amt)
        acc.ids.push(list.id)
        acc.total = acc.total.plus(list.amt)
        return acc
      },
      { address: [], value: [], ids: [], total: BN(0) }
    )

    if (total.gt(bfanstr)) {
      message.error('转账金额超过余额')
      return
    }
    try {
      const data = await onMultisend(address, value)
      if (!data?.transactionHash) return
      await inscriptionsApi.wrap_unwrapdelete({ ids, hash: data.transactionHash })
    } catch (error) {
      console.log('error', error)
    }
  }

  const bfanstobfan = async () => {
    if (!wrappedAddress || !account) return
    const { data, ids, total } = selectedRowKeys.reduce(
      (acc: any, key) => {
        const list = warpList[key]
        const obtrs = {
          p: 'bnb-48',
          op: 'transfer',
          'tick-hash': tickHash, // fans
          to: list.to,
          amt: list.amt,
        }
        acc.data.push(obtrs)
        acc.ids.push(list.id)
        acc.total = acc.total.plus(list.amt)
        return acc
      },
      { data: [], ids: [], total: BN(0) }
    )
    if (total.gt(userBlance || 0)) {
      message.error('转账金额超过余额')
      return
    }
    try {
      const str = `data:application/json,
    ${JSON.stringify(data)}
    `
      console.log('[str]:', str, chainId)
      const hexs = str.replace(/\s*/g, '')
      const tx = await onbfanstofans(hexs)
      if (!tx?.transactionHash) return
      await inscriptionsApi.wrap_unwrapdelete({ ids, hash: tx?.transactionHash })
    } catch (error) {
      console.log('error', error)
    }
  }

  const onSubmit = async () => {
    if (menuType == FANSTYPE.fanstobfans) {
      await fanstobfans()
    } else {
      await bfanstobfan()
    }
    setSelectedRowKeys([])
    getData()
    getBlances()
  }

  return (
    <div className="md:px-8 px-[16px] max-w-6xl mx-auto pt-[32px] pb-[32px]">
      <div className="pb-[12px] flex justify-between ">
        <div className="diy-scrollbar px-[10px]">
          <Radio.Group
            className="h-[50px]"
            value={menuType}
            onChange={(val) => setMenuType(val.target.value)}
            disabled={multisendLoading || BfansToFansLoading}
          >
            <Radio.Button
              value={FANSTYPE.fanstobfans}
              style={{ background: menuType === FANSTYPE.fanstobfans ? '#fff' : '#E9E9E9' }}
              className=" leading-[40px] flex-1 h-[40px] text-center no-border mr-[12px]"
            >
              fans to bfans
            </Radio.Button>
            <Radio.Button
              value={FANSTYPE.bfanstobfan}
              style={{ background: menuType === FANSTYPE.bfanstobfan ? '#fff' : '#E9E9E9' }}
              className=" leading-[40px] flex-1 h-[40px] text-center no-border"
            >
              bfans to fans
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="flex align-center ">
          <div className="flex items-center gap-[12px]  mr-[24px]">
            <div>总计: {decimalsToStr(selectedTotalAmount, 8)}</div>
            <div>bfans余额: {decimalsToStr(bfanstr, 8)}</div>
            <div>fans余额: {decimalsToStr(userBlance || 0, 8)}</div>
          </div>

          <Button
            type="primary"
            size="large"
            disabled={!account || !hasSelected}
            loading={multisendLoading || BfansToFansLoading}
            className="md:w-40 w-[158px] h-12 text-[14px] rounded bg-yellow no-border"
            onClick={onSubmit}
          >
            通过
          </Button>
        </div>
      </div>

      <Table rowSelection={rowSelection} loading={loadinglist} columns={columns} dataSource={warpList} />
    </div>
  )
}

export default App
