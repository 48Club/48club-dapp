import React from 'react'
import { Card, Typography, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
// import { Table } from 'antd'

const { Title, Text } = Typography

// mock 数据
// const stats = {
//   total: 689898,
//   reward: 689898,
//   entry: 689898,
// }

// const ranking = Array.from({ length: 11 }).map((_, i) => ({
//   key: i + 1,
//   rank: `第${i + 1}名${i === 0 ? ' 🥇' : i === 1 ? ' 🥈' : i === 2 ? ' 🥉' : ''}`,
//   address: '0x7E3...3da6F',
//   volume: 876088,
//   reward: 876088,
// }))

// const columns = [
//   { title: '排名', dataIndex: 'rank', key: 'rank', align: 'center' as const },
//   { title: '地址', dataIndex: 'address', key: 'address', align: 'center' as const },
//   { title: '交易量', dataIndex: 'volume', key: 'volume', align: 'center' as const },
//   { title: '预计奖金', dataIndex: 'reward', key: 'reward', align: 'center' as const },
// ]

export default function TradeRacePage() {
  const { t } = useTranslation()
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
        <div className='work-break-all' style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
          <div className='font-bold text-[14px]'>📊 {t('trade_race_rule_title')}</div>
          <div>📌 {t('trade_race_rule_desc1')}</div>
          <div>{t('trade_race_rule_desc2')}</div>
          <div>🥇 {t('trade_race_rule_desc3')}</div>
          <div>{t('trade_race_rule_desc4')}</div>
          <div>🎯 {t('trade_race_rule_desc5')}</div>
        </div>
        <div className='work-break-all' style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
          <div className='font-bold text-[14px]'>🎁 {t('trade_race_reward_title')}</div>
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 120,
          marginBottom: 24,
          background: 'linear-gradient(90deg, #fffbe6 0%, #fff 100%)',
          borderRadius: 12,
          border: '1px dashed #E2B201',
        }}>
          <span style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#E2B201',
            letterSpacing: 2,
            marginBottom: 4,
          }}>Coming Soon</span>
          <span className='text-center' style={{ color: '#888', fontSize: 14 }}>{t('trade_race_eventdata_commit')}</span>
        </div>
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>{t('trade_race_leaderboard_title')}</Title>
          {/* <Text style={{ marginLeft: 24, color: '#888' }}>空投记录</Text> */}
          {/* <Text style={{ marginLeft: 24, color: '#E2B201' }}>我的交易量：{stats.total}</Text> */}
        </div>
        {/*
        <Table
          columns={columns}
          dataSource={ranking}
          pagination={false}
          bordered
          style={{ marginBottom: 24 }}
        />
        */}
        {/* Coming Soon 替换排行榜表格 */}
        <div style={{
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
        </div>
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
