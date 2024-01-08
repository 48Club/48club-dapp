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
import { useNavigate } from 'react-router-dom'
import Empty from '@/components/Empty'
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

const DeploymentsList = ({ tabType }: { tabType: string }) => {
  const { effectData } = useInscriptionsEffectData()

  const { setLoading, loading, searchText, searchTextHash } = useInscriptionsSearchState()

  const { account } = useEthers()
  const nav = useNavigate()

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [records, setRecord] = useState<ExplorerDataProps[]>([])

  useEffect(() => {
    getInscriptionsData()
  }, [searchTextHash, searchText])

  const isMyAddress = useMemo(() => {
    const isManage = searchText?.toLocaleLowerCase() === account?.toLocaleLowerCase()
    return isManage
  }, [searchText, account])

  const getInscriptionsData = async () => {
    setLoading(true)

    const _searchText = {
      tick_hash: '',
      tick: '',
      deploy_by: searchText,
    }

    if (searchTextHash.startsWith('0x') && searchTextHash.length === 66) {
      _searchText.tick_hash = searchTextHash
    } else {
      // 其他则是tick
      _searchText.tick = searchTextHash
    }
    const param = {
      status: 0,
      page,
      protocol: tabType,
      ..._searchText,
    }
    inscriptionsApi
      .getInscriptionsList(param)
      .then((res) => {
        setLoading(false)
        if (res.code === 0) {
          console.log(res.data, 'res')
          setTotal(res.data.count)
          setRecord(res.data.list)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <MyTable
      dataSource={records}
      loading={loading}
      pagination={{
        hideOnSinglePage: true,
        pageSize: 20,
        total: total,
        onChange: setPage,
        current: page,
        defaultCurrent: 1,
      }}
      locale={{
        emptyText: loading ? ' ' : <Empty />,
      }}
    >
      <MyColumn
        title="Token"
        dataIndex="tick"
        key="tick"
        render={(_: any, record: ExplorerDataProps) => {
          const curentData = effectData.find((d) => d.tick_hash === record.tick_hash)
          let currnet = effectDatasParam
          if (curentData) {
            currnet = {
              borderIcon: getStaticUrl('border', curentData.border),
              lvIcon: getStaticUrl('lv', curentData.lv),
              avatarIcon: getStaticUrl('avatar', curentData.tick_hash),
            }
          }

          return (
            <>
              <div className="min-w-[200px] flex items-center text-[#E2B201] text-[16px] font-[400] leading-[20px]">
                <div className="w-[28px] h-[28px] rounded-full relative">
                  <img className="w-full h-full" src={currnet.avatarIcon} alt="" />
                  {currnet.borderIcon && (
                    <img
                      className="w-[42px] translate-x-[-50%] translate-y-[-50%] h-[42px] absolute left-[50%] top-[50%]"
                      src={currnet.borderIcon}
                      alt=""
                    />
                  )}
                </div>
                <div className="ml-[6px] flex-1">
                  <div className="flex items-center">
                    <span className="font-[700] flex-1 w-0 text-ellipsis whitespace-nowrap overflow-hidden max-w-[105px]">
                      {record.tick}
                    </span>
                    {effectDatasParam.lvIcon && (
                      <img className="w-[14px] h-[14px] mx-[2px]" src={currnet.lvIcon} alt="" />
                    )}
                    <span className="ml-[8px] px-[6px] h-[17px] leading-[17px] font-[400] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">
                      {tabType.toLocaleUpperCase()}
                    </span>
                  </div>
                  <div className="text-[#A9A9A9] opacity-70 text-[12px] font-[400] ">
                    <Typography.Paragraph
                      className="m-[0_!important] explorer-copy-color"
                      copyable={{ text: record.tick_hash }}
                    >
                      {shorten(record.tick_hash, 3)}
                    </Typography.Paragraph>{' '}
                  </div>
                </div>
              </div>
            </>
          )
        }}
      />
      <MyColumn
        title="Progress"
        dataIndex="progress"
        key="progress"
        width={'30%'}
        render={(_: any, record: ExplorerDataProps) => {
          const progress = ((record.minted / record.max) * 100).toFixed(2)

          return (
            <div
              className="mt-[24px] mb-[24px] cursor-[pointer]"
              onClick={() => {
                nav(`/inscriptions/explorer/detail/${record.tick_hash}`)
              }}
            >
              <div className=" text-[16px] font-[400] leading-[24px] text-[#1E1E1E] text-left mb-[14px]">
                {progress}%
              </div>
              <div className="flex-1 h-[12px] md:h-[9px] overflow-hidden rounded-full bg-[rgba(255,200,1,.2)] w-[105px]">
                <div style={{ width: `${progress}%` }} className="h-full rounded-full bg-[#FFC801]"></div>
              </div>
            </div>
          )
        }}
      />
      <MyColumn
        title="Operation"
        align={'end'}
        key={'Operation'}
        render={(_: any, record: ExplorerDataProps) => (
          <Button
            disabled={account?.toLocaleLowerCase() !== record.deploy_by.toLocaleLowerCase()}
            onClick={() => nav('/inscriptions/account/recap/' + record.tick_hash)}
            type="primary"
            className="md:w-[65px]  disabled:hover:h-[40px] disabled:h-[40px] w-[96px] h-[40px] bg-yellow"
          >
            Recap
          </Button>
        )}
      />
    </MyTable>
  )
}

export default DeploymentsList
