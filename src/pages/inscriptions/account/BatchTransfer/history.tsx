import React, { useEffect, useMemo, useState } from 'react'
import { Button, Space, Table, Tag, Typography } from 'antd'
import { styled } from 'styled-components'
import { shorten } from '@funcblock/dapp-sdk'
import bnb48 from '@/assets/images/avatar.svg'
import { useInscriptionsEffectData, useInscriptionsSearchState } from '@/store'
import { ExplorerDataProps } from '@/utils/request.type'
import inscriptionsApi from '@/utils/request'
import { useEthers } from '@usedapp/core'
import { getStaticUrl } from '@/App'
import { useNavigate, useParams } from 'react-router-dom'
import { TransfersRowDataProps } from '../../explorer_detail/Rows/TransfersRow'
import { ZeroAddress } from '@/constants/contracts'
import moment from 'moment'
import { decimalsToStr } from '@/utils'
import Empty from '@/components/Empty'
import { compareAddress } from '@/utils/addresses'
const { Column, ColumnGroup } = Table

const MyTable = styled(Table)`
  .ant-table-thead {
    .ant-table-cell {
      background: transparent;
      font-weight: 400;
      font-size: 16px;
      color: rgb(169 169 169);
    }
    .ant-table-cell::before {
      display: none !important ;
    }
  }

  .ant-table-tbody {
    .ant-table-cell {
      cursor: pointer;

      padding: 0 16px;
    }
  }
`
const MyColumn = styled(Column)`
  color: red !important;
  &.dddx {
    color: red !important;
  }
  &.dddx::before {
  }
`

let effectDatasParam: any = {
  avatarIcon: bnb48,
  lvIcon: undefined,
  borderIcon: undefined,
}

const BatcHistory = () => {
  const { hash } = useParams()
  const { effectData } = useInscriptionsEffectData()

  const { setLoading, loading, searchText, searchTextHash, result } = useInscriptionsSearchState()

  const { account } = useEthers()
  const nav = useNavigate()

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [transferRecords, setTransferRecords] = useState<TransfersRowDataProps[]>([])

  const getTransferList = (hashVal: string, addressVal: string) => {
    setLoading(true)
    inscriptionsApi
      .getUserBalances({
        tick_hash: [hashVal],
        address: addressVal,
      })
      .then((res) => {
        setLoading(false)
        if (res.code === 0) {
          const hasDatas = res.data.wallet.filter((i) => i.changes && i.changes.length > 0)
          const newData: any = []
          hasDatas.forEach((data) => {
            data.changes.forEach((i) => {
              const item = {
                ...data,
                ...i,
                amount: decimalsToStr(i.input_decode.amt, data.decimals),
              }
              if (compareAddress(addressVal, i.from) || compareAddress(addressVal, i.to)) {
                newData.push(item)
              }
            })
          })
          setTransferRecords(newData)
        }
        // console.log(res, 'transfer list')
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    if (hash && account) {
      getTransferList(hash, account)
    }
  }, [hash, account])
  const change = (tx: any) => {
    window.open('https://bscscan.com/tx/' + tx)
  }
  return (
    <MyTable
      dataSource={transferRecords}
      locale={{
        emptyText: loading ? ' ' : <Empty />,
      }}
      pagination={{
        hideOnSinglePage: true,
        pageSize: 20,
        total: total,
        onChange: setPage,
        current: page,
        defaultCurrent: 1,
      }}
      onRow={(record) => {
        return {
          onClick: () => change(record.tx_hash),
        }
      }}
      loading={loading}
    >
      <MyColumn
        title="Method"
        dataIndex="Method"
        key="Method"
        render={(_: any, record: TransfersRowDataProps) => {
          return <div className=" flex items-center cursor-pointer">{record?.input_decode?.op}</div>
        }}
      />
      <MyColumn
        title="Status"
        dataIndex="is_pending"
        key="is_pending"
        render={(_: any, record: TransfersRowDataProps) => {
          return (
            <div className=" flex items-center cursor-pointer text-[#A9A9A9]">
              {record.is_pending ? (
                <div className="flex items-center">
                  <div className="spinner center">
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                  </div>
                  <span className="ml-[4px] opacity-40">pending</span>
                </div>
              ) : (
                <span className="">confirmed</span>
              )}
            </div>
          )
        }}
      />

      <MyColumn
        title="Amount"
        dataIndex="amount"
        key="amount"
        render={(_: any, record: TransfersRowDataProps) => {
          return <div className="flex items-center cursor-pointer">{record?.amount}</div>
        }}
      />
      <MyColumn
        title="From"
        dataIndex="amount"
        key="amount"
        render={(_: any, record: TransfersRowDataProps) => {
          return (
            <div className=" underline text-[#A9A9A9]">
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  const toAddress = record?.input_decode?.op === 'mint' ? ZeroAddress : record.from
                  window.open(`${window.location.origin}/inscriptions/account?address=${toAddress}`)
                }}
                className=" cursor-pointer py-[20px] hover:text-black"
              >
                {record?.input_decode?.op === 'mint' ? shorten(ZeroAddress) : shorten(record.from)}
              </span>
            </div>
          )
        }}
      />

      <MyColumn
        title="To"
        dataIndex="to"
        key="To"
        render={(_: any, record: TransfersRowDataProps) => {
          return (
            <div className=" underline py-[20px] text-[#A9A9A9]">
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  const toAddress = record?.input_decode?.op === 'mint' ? record.to : record?.input_decode?.to
                  window.open(`${window.location.origin}/inscriptions/account?address=${toAddress}`)
                }}
                className=" cursor-pointer hover:text-black"
              >
                {record?.input_decode?.op === 'mint' ? shorten(record.to) : shorten(record?.input_decode?.to)}
              </span>
            </div>
          )
        }}
      />
      <MyColumn
        title="Date Time"
        align={'end'}
        key={'Date Time'}
        render={(_: any, record: TransfersRowDataProps) => (
          <div className=" flex justify-end items-center">
            <span className=" underline mr-[8px]">
              {record.block_at ? moment(record.block_at * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.2387 7.24886V10.873C11.2387 11.4835 10.7256 12 10.1193 12H1.11938C0.513048 12 0 11.4835 0 10.873V1.81258C0 1.20217 0.513048 0.685669 1.11938 0.685669H4.71935C4.99574 0.685669 5.23931 0.929136 5.23931 1.20739C5.23931 1.48563 4.99747 1.73084 4.71935 1.73084H1.11938C1.06755 1.73084 1.03819 1.7604 1.03819 1.81258V10.873C1.03819 10.9252 1.06755 10.9548 1.11938 10.9548H10.1193C10.1711 10.9548 10.2005 10.9252 10.2005 10.873V7.24886C10.2005 6.97061 10.4423 6.72714 10.7187 6.72714C10.9951 6.72714 11.2387 6.97061 11.2387 7.24886Z"
                fill="black"
              />
              <path
                d="M11.237 1.20739V4.52898C11.237 4.80723 10.9952 5.05069 10.7188 5.05069C10.4424 5.05069 10.2006 4.80723 10.2006 4.52898V2.46472L6.29832 6.39151C6.20503 6.48541 6.07893 6.53411 5.92001 6.53411C5.76108 6.53411 5.63498 6.48715 5.5417 6.39324C5.44151 6.29238 5.38623 6.16195 5.38623 6.0263C5.38623 5.89066 5.44151 5.76023 5.5417 5.65936L9.47334 1.73084H7.41942C7.14303 1.73084 6.90119 1.48737 6.90119 1.20739C6.90119 0.929136 7.14303 0.685669 7.41942 0.685669H10.7188C10.9952 0.685669 11.237 0.929136 11.237 1.20739Z"
                fill="black"
              />
            </svg>
          </div>
        )}
      />
    </MyTable>
  )
}

export default BatcHistory
