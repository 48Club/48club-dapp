import React, { useEffect, useMemo, useState } from 'react'
import { Card, Typography, Divider, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { getTradeRace } from '@/utils/axios'
import { useMediaQuery } from 'react-responsive'
import { useEthers } from '@usedapp/core'
import { formatAmount } from '@funcblock/dapp-sdk'
// import { Table } from 'antd'

const { Title, Text } = Typography

export default function TradeRacePage() {
  const { t } = useTranslation()
  const { account } = useEthers()
  const [ranklist, setRanklist] = useState<any[]>([])
  const [userRank, setUserRank] = useState<any>({})
  const [total, setTotal] = useState(0)
  const [fee, setFee] = useState<any>({})
  const [currentAccount, setCurrentAccount] = useState('')
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const getRankText = (data: any) => {
    if (data.rank === 0) {
      return t('trade_race_out_rank')
    }
    if (data.rank === 'random') {
      return t('trade_race_in_rank')
    }
    if (data.rank < total) {
      return t('trade_race_rank_number', {rank : data.rank })
    }
    return t('trade_race_rank_number_last')
  }
  const columns = [
    {
      title: t('trade_race_rank_title'),
      key: 'index',
      align: 'center' as const,
      render: (_: any, data: any, index: any) => {
        return <div className={`${currentAccount.toLocaleLowerCase() === data.address.toLocaleLowerCase() ? 'font-bold text-[#E2B201]' : ''}`}>{getRankText(data)}</div>
      },
    },
    { title: t('trade_race_address'), dataIndex: 'address', key: 'address', align: 'center' as const,
      render: (text: any) => {
        return <div className={`font-mono ${currentAccount.toLocaleLowerCase() === text.toLocaleLowerCase() ? 'font-bold text-[#E2B201]' : ''}`}>{text}</div>
      }
     },
    { title: t('trade_race_volume'), dataIndex: 'usdt_amount', key: 'usdt_amount', align: 'center' as const, render: (text: any, data: any) => {
      return <div className={`${currentAccount.toLocaleLowerCase() === data.address.toLocaleLowerCase() ? 'font-bold text-[#E2B201]' : ''}`}>{text}</div>
    } },
    // { title: '预计奖金', dataIndex: '', key: '', align: 'center' as const },
  ]
  const addRankToList = (list: any[], total: number) => {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (index < list.length -1) {
        element.rank = index + 1
      } else {
        element.rank = total
      }
    }
    return list
  }
  const lastRankDetail = useMemo(() => {
    const data = ranklist.find(item => item.rank === total)
    return data
  }, [ranklist, total])
  useEffect(() => {
    getTradeRace({}).then((res) => {
      console.log(res)
      if (res.status === 200 && res.data.status === 200) {
        const dealList = addRankToList(res.data.data.top_n, res.data.data.total)
        setRanklist(dealList)
        setTotal(res.data.data.total)
        setFee(res.data.data.fee)
      }
    })
  }, [])
  useEffect(() => {
    if (account) {
      // const address = '0x64Bd8AB0F47Baa9c692fF5e29DDAb3F833bA3E80'
      const address = account
      getTradeRace({address}).then((res) => {
        console.log(res)
        if (res.status === 200 && res.data.status === 200) {
          const selfData = res.data.data.this;
          const isInRankList = res.data.data.top_n.find((item: any) => item.address.toLocaleLowerCase() === account.toLocaleLowerCase())
          let list = addRankToList(res.data.data.top_n, res.data.data.total)
          if (!isInRankList) {
            const outRankAmount = list[list.length - 1].usdt_amount.replace(/[$,]/g, "");
            const accountAmount = selfData.usdt_amount.replace(/[$,]/g, "");
            if (+accountAmount > +outRankAmount) {
              const insertIndex = Math.max(list.length - 1, 0);
              list = [...list];
              list.splice(insertIndex, 0, {...selfData, rank: 'random'});
            } else {
              list.push({...selfData, rank: 0})
            }
          }
          setRanklist(list)
          setUserRank(selfData)
          setCurrentAccount(address)
          setTotal(res.data.data.total)
        }
      })
    }
  }, [account])
  return (
    <div style={{ background: '#fff', padding: 24, minHeight: '100vh' }}>
      <Card bordered={false} style={{ margin: '0 auto', maxWidth: 900 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
          {t('trade_race_title')}
        </Title>
        <div style={{ textAlign: 'center', color: '#E2B201', margin: '8px 0' }}>
          <Text strong>⏰ {t('trade_race_time')}</Text>
          {t('trade_race_time_desc')}
        </div>
        <div className="work-break-all" style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
          <div className="font-bold text-[14px]">📊 {t('trade_race_rule_title')}</div>
          <div>📌 {t('trade_race_rule_desc1')}</div>
          <div>{t('trade_race_rule_desc2')}</div>
          <div>🥇 {t('trade_race_rule_desc3')}</div>
          <div>{t('trade_race_rule_desc4')}</div>
          <div>🎯 {t('trade_race_rule_desc5')}</div>
        </div>
        <div className="work-break-all" style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
          <div className="font-bold text-[14px]">🎁 {t('trade_race_reward_title')}</div>
          <div>•{t('trade_race_reward_desc1')}</div>
          <div>•{t('trade_race_reward_desc2')}</div>
          <div>•{t('trade_race_reward_desc3')}</div>
          <div>•{t('trade_race_reward_desc4')}</div>
        </div>
        <Divider />
        {fee.usdt_amount && <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 24 }}>
          <div>
            <Text>活动总交易量</Text>
            <div style={{ fontSize: 22, color: '#E2B201', fontWeight: 700 }}>${fee.usdt_amount}</div>
          </div>
          <div>
            <Text>奖励总金额</Text>
            <div style={{ fontSize: 22, color: '#E2B201', fontWeight: 700 }}>${(+fee.usdt_amount * 0.96).toFixed(2)}</div>
          </div>
          <div>
            <Text>入围交易量</Text>
            <div style={{ fontSize: 22, color: '#E2B201', fontWeight: 700 }}>{lastRankDetail.usdt_amount}</div>
          </div>
        </div>}
        
       
        {/* Coming Soon for stats */}
        {/* <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 120,
            marginBottom: 24,
            background: 'linear-gradient(90deg, #fffbe6 0%, #fff 100%)',
            borderRadius: 12,
            border: '1px dashed #E2B201',
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#E2B201',
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            Coming Soon
          </span>
          <span className="text-center" style={{ color: '#888', fontSize: 14 }}>
            {t('trade_race_eventdata_commit')}
          </span>
        </div> */}
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            {t('trade_race_leaderboard_title')}
          </Title>
          {/* <Text style={{ marginLeft: 24, color: '#888' }}>空投记录</Text> */}
          {account && <Text style={{ marginLeft: 24, color: '#E2B201' }}>我的交易量：{userRank?.usdt_amount}</Text>}
          
        </div>

        <div style={{ marginBottom: 24 }}>
          {!isMobile ? (
            // PC端显示表格
            <Table columns={columns} dataSource={ranklist} pagination={false} bordered style={{ marginBottom: 24 }} />
          ) : (
            // 移动端竖排卡片
            <div>
              {ranklist.map((rank: any, index: any) => (
                <Card
                  key={index}
                  style={{
                    marginBottom: 12,
                    border: `1px solid #f0f0f0`,
                    borderRadius: 8,
                  }}
                  styles={{ body: { padding: 16 } }}
                >
                  {
                    columns.map((column, columnIndex) => {
                      return columnIndex <= 0 ? (<div key={column.key} className='font-bold' style={{ margin: '8px 0', color: '#333' }}>
                        <span>{column.render?.(rank[column.dataIndex || ''], rank, index)}</span>
                      </div>) : (<div className='flex' key={column.key} style={{ margin: '8px 0', color: '#333' }}>
                        <span style={{ fontWeight: 500 }}>{column.title}：</span>
                        <span>{column.render?.(rank[column.dataIndex || ''], rank, index)}</span>
                      </div>)
                    })
                  }
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon 替换排行榜表格 */}
        {/* <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 200,
          marginBottom: 24,
          background: 'linear-gradient(90deg, #fffbe6 0%, #fff 100%)',
          borderRadius: 12,
          border: '1px dashed #E2B201',
        }}>
          <span style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#E2B201',
            letterSpacing: 2,
            marginBottom: 8,
          }}>Coming Soon</span>
          <span className='text-center' style={{ color: '#888', fontSize: 14 }}>{t('trade_race_leaderboard_commit')}</span>
        </div> */}
        <Divider />
        <div style={{ color: '#888', fontSize: 13 }}>
          <div>❗️{t('trade_race_note_title')}</div>
          <div>• {t('trade_race_note_desc1')}</div>
          <div>• {t('trade_race_note_desc2')}</div>
          <div>• {t('trade_race_note_desc3')}</div>
        </div>
      </Card>
    </div>
  )
}
