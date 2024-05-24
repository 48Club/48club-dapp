import inscriptionsApi from '@/utils/request'
import type { TableColumnsType } from 'antd'
import { Button, Radio, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { decimalsToStr } from '@/utils'
import moment from 'moment'
import { useEthers, useSendTransaction } from '@usedapp/core'
import * as utils from 'web3-utils'
import { useWrappedContract } from '@/hooks/useContract'
import { useWrapAcitons } from '../inscriptions/hooks'
import { wrappedAddress } from '@/constants/contracts'
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

const App = () => {
  const { account, chainId } = useEthers()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [menuType, setMenuType] = useState<FANSTYPE>(FANSTYPE.bfanstobfan)
  const [loadinglist, setLoadingList] = useState(false)
  const [warpList, setwarpList] = useState<any[]>([])

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

  console.log(selectedRowKeys)

  const fanstobfans = async () => {
    const { address, value, ids } = selectedRowKeys.reduce(
      (acc: any, key) => {
        const list = warpList[key]
        acc.address.push(list.to)
        acc.value.push(list.amt)
        acc.ids.push(list.id)
        return acc
      },
      { address: [], value: [], ids: [] }
    )

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
    const { data, ids } = selectedRowKeys.reduce(
      (acc: any, key) => {
        const list = warpList[key]
        const obtrs = {
          p: 'bnb-48',
          op: 'transfer',
          'tick-hash': '0xd893ca77b3122cb6c480da7f8a12cb82e19542076f5895f21446258dc473a7c2', // fans
          to: list.to,
          amt: list.amt,
        }
        acc.data.push(obtrs)
        acc.ids.push(list.id)
        return acc
      },
      { data: [], ids: [] }
    )

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
    getData()
  }

  useEffect(() => {
    getData()
  }, [menuType])

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const hasSelected = selectedRowKeys.length > 0

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
        <div>
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
