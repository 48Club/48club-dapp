import React, { useEffect, useState } from 'react'
import { Card, Typography, Divider, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { getTradeRace } from '@/utils/axios'
import { useMediaQuery } from 'react-responsive'
// import { Table } from 'antd'

const { Title, Text } = Typography

export default function TradeRacePage() {
  const { t } = useTranslation()
  const [ranklist, setRanklist] = useState([])
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const columns = [
    {
      title: t('trade_race_rank_title'),
      key: 'index',
      align: 'center' as const,
      render: (_: any, data: any, index: any) => {
        return <div>{index + 1 >= ranklist.length ? t('trade_race_rank_number_last') : t('trade_race_rank_number', {rank : index + 1 })}</div>
      },
    },
    { title: t('trade_race_address'), dataIndex: 'address', key: 'address', align: 'center' as const,
      render: (text: any) => {
        return <div className='font-mono'>{text}</div>
      }
     },
    { title: t('trade_race_volume'), dataIndex: 'usdt_amount', key: 'usdt_amount', align: 'center' as const, render: (text: any) => {
      return <div>{text}</div>
    } },
    // { title: '预计奖金', dataIndex: '', key: '', align: 'center' as const },
  ]
  useEffect(() => {
    getTradeRace().then((res) => {
      console.log(res)
      if (res.status === 200 && res.data.status === 200) {
        setRanklist(res.data.data.top_n)
      }
    })
  }, [])
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
        {/*
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 24 }}>
          <div>
            <Text>活动总交易量</Text>
            <div style={{ fontSize: 22, color: '#E2B201', fontWeight: 700 }}>{stats.total}</div>
          </div>
          <div>
            <Text>奖励总金额</Text>
            <div style={{ fontSize: 22, color: '#E2B201', fontWeight: 700 }}>{stats.reward}</div>
          </div>
          <div>
            <Text>入围交易量</Text>
            <div style={{ fontSize: 22, color: '#E2B201', fontWeight: 700 }}>{stats.entry}</div>
          </div>
        </div>
        */}
        {/* Coming Soon for stats */}
        <div
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
        </div>
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            {t('trade_race_leaderboard_title')}
          </Title>
          {/* <Text style={{ marginLeft: 24, color: '#888' }}>空投记录</Text> */}
          {/* <Text style={{ marginLeft: 24, color: '#E2B201' }}>我的交易量：{stats.total}</Text> */}
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
                    border: '1px solid #f0f0f0',
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
