import React, { useEffect, useMemo, useState } from 'react'
import { Button, Space, Table, Tag, Typography } from 'antd'
import { styled } from 'styled-components'
import { formatAmount, shorten } from '@funcblock/dapp-sdk'
import bnb48 from '@/assets/images/avatar.svg'
import { useInscriptionsEffectData, useInscriptionsSearchState } from '@/store'
import { ExplorerDataProps } from '@/utils/request.type'
import inscriptionsApi from '@/utils/request'
import { useEthers } from '@usedapp/core'
import { getStaticUrl } from '@/App'
import { useNavigate } from 'react-router-dom'
import Empty from '@/components/Empty'
import Label from '@/components/Label'
import { useRedeemInfo, useStakeInscriptionAcitons } from '../../hooks'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
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

const StaketableList = () => {
  const { t } = useTranslation()

  const redeemInfo = useRedeemInfo()

  const [canLoading, setcanLoading] = useState<any>(0)
  const [finalizeLoading, setfinalizeLoading] = useState<any>(0)

  const { oncancelRedeem, onfinalizeRedeem, cancelReddemLoading, finalizeRedeemLoading } = useStakeInscriptionAcitons()

  const changeRedeem = (val: number) => {
    setcanLoading(val)
    oncancelRedeem(val)
  }
  const changefinalizeRedeem = (val: number) => {
    setfinalizeLoading(val)
    onfinalizeRedeem(val)
  }

  return (
    <div className="mt-[80px] ">
      <div className="mb-[24px]">
        <Label text={'ListRedeem'} />
      </div>
      <MyTable
        dataSource={redeemInfo}
        loading={!redeemInfo}
        pagination={{
          hideOnSinglePage: true,
          pageSize: 100,
        }}
        locale={{
          emptyText: !redeemInfo ? ' ' : <Empty />,
        }}
      >
        <MyColumn
          title="Id"
          key="ID"
          // width={'60px'}
          render={(_: any, record, index) => `#${index + 1}`}
        />
        <MyColumn
          title="Amount"
          dataIndex="amount"
          key="Amount"
          align={'center'}
          render={(_: any, record: any) => {
            return (
              <div className="mt-[24px] mb-[24px] cursor-[pointer] flex justify-center">
                <div className=" text-[16px] font-[400] leading-[24px] text-[#1E1E1E] text-left mb-[14px]">
                  {formatAmount(record?.amount, 8)}
                </div>
              </div>
            )
          }}
        />
        <MyColumn
          title="EndTime"
          dataIndex="endTime"
          key="EndTime"
          align={'center'}
          render={(_: any, record: any) => {
            return record?.endTime ? moment(record?.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
          }}
        />
        <MyColumn
          title="Operation"
          align={'end'}
          key={'Operation'}
          width={'200px'}
          render={(_: any, record: any, index) => {
            return (
              <div className="flex gap-[8px] flex justify-end">
                <Button
                  size="large"
                  className="md:m-w-[80px]    w-[96px]  h-[40px] bg-gray  no-border"
                  onClick={() => changeRedeem(index)}
                  loading={canLoading === index && cancelReddemLoading}
                >
                  {t('pool_cancel')}
                </Button>
                <Button
                  // disabled={Date.now() / 1000 < record?.endTime}
                  loading={finalizeLoading === index && finalizeRedeemLoading}
                  type="primary"
                  className="md:m-w-[80px]  disabled:hover:h-[40px] disabled:h-[40px] w-[96px] h-[40px] bg-yellow"
                  onClick={() => changefinalizeRedeem(index)}
                >
                  Redeem
                </Button>
              </div>
            )
          }}
        />
      </MyTable>
    </div>
  )
}

export default StaketableList
