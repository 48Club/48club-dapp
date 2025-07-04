import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, Typography, Divider, Table, Button } from 'antd'
import { useTranslation, Trans } from 'react-i18next'
import { getTradeRace, getTradeRaceAirdrop } from '@/utils/axios'
import { useMediaQuery } from 'react-responsive'
import { useEthers } from '@usedapp/core'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/zh-cn'
import AddressSearch, { AddressSearchRef } from './search'
import AddressSearchModal from './AddressSearchModal'
import OdometerNumber from '@/components/OdometerNumber'
// import { Table } from 'antd'

dayjs.extend(utc)

const { Title, Text } = Typography
const formatNumber = (num: string | number) => {
  if (Number.isFinite(Number(num))) {
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
  return '--'
}
export default function TradeRacePage() {
  const ratio = 0.648 * 2 // 总奖池的 64.8% 转为KOGE的比例

  const { t, i18n } = useTranslation()
  const { account } = useEthers()
  const [ranklist, setRanklist] = useState<any[]>([])
  const [userRank, setUserRank] = useState<any>({})
  const [total, setTotal] = useState(0)
  const [fee, setFee] = useState<any>({})
  const [tradeFeeThisWeek, setTradeFeeThisWeek] = useState('')
  const [currentAccount, setCurrentAccount] = useState('')
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 0])
  const [nonce, setNonce] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const searchRef = useRef<AddressSearchRef>(null)
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [addressSearchModalVisible, setAddressSearchModalVisible] = useState(false)
  const getRankText = (data: any) => {
    if (data.rank === 0) {
      return t('trade_race_out_rank')
    }
    if (data.rank === 'random') {
      return t('trade_race_in_rank')
    }
    // if (data.rank < total) {
    //   return t('trade_race_rank_number', {rank : data.rank })
    // }
    return t('trade_race_rank_number', {rank : data.rank })
  }
  const getClass = (data: any) => {
    if (currentAccount.toLocaleLowerCase() === data.address.toLocaleLowerCase()) {
      if (data.rank === 0) {
        return 'font-bold text-[#a9a9a9]'
      }
      return 'font-bold text-[#E2B201]'
    }
    return ''
  }
  const columns = [
    {
      title: t('trade_race_rank_title'),
      key: 'index',
      align: 'center' as const,
      render: (_: any, data: any, index: any) => {
        return <div id={data.address} className={`${getClass(data)}`} style={{ scrollMarginTop: '100px' }}>{getRankText(data)}</div>
      },
    },
    { title: t('trade_race_address'), dataIndex: 'address', key: 'address', align: 'center' as const,
      render: (text: any, data: any) => {
        return <div className={`font-mono break-all ${getClass(data)}`}>{text}</div>
      }
     },
    { title: t('trade_race_volume'), dataIndex: 'usdt_amount', key: 'usdt_amount', align: 'center' as const, render: (text: any, data: any) => {
      return <div className={`${getClass(data)}`}>${formatNumber(text)}</div>
    } },
    { title: t('trade_race_expected'), dataIndex: 'reward', key: 'reward', align: 'center' as const, render: (text: any, data: any) => {
      let amount = '0'
      if (!fee?.usdt_amount) {
        amount = '0'
      } else {
          const totalFeeKoge = +fee.koge_amount * ratio
          const totalFee = +fee?.usdt_amount * ratio
        const reward = (totalFee / total).toFixed(2)
        const rewardKoge = (totalFeeKoge / total).toFixed(4)
        if (data.rank === 0) {
          amount = '0'
        } else {
          amount = `${rewardKoge} KOGE (${reward} USDT)`
        }
      }
      
      return <div className={getClass(data)}>{amount}</div>
    } },
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
  const getDataByAddress = (address: string) => {
    // const address = account
    getTradeRace({address}).then((res) => {
      console.log(res)
      if (res.status === 200 && res.data.status === 200 && res.data.data.top_n && res.data.data.top_n.length > 0) {
        const selfData = res.data.data.this;
        const isInRankList = res.data.data.top_n.find((item: any) => item.address.toLocaleLowerCase() === address.toLocaleLowerCase())
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
        setTotal(res.data.data.total)
        setFee(res.data.data.fee)
        setTradeFeeThisWeek(res.data.data.trade_total_this_week)
        // Set nonce if available in response
        if (res.data.data.nonce) {
          setNonce(res.data.data.nonce)
        }
      }
    })
  }
  const handleSearch = (address: string) => {
    setCurrentAccount(address)
    getDataByAddress(address)
  }
  const formatTimeRange = useMemo(() => {
    const [start, end] = timeRange
    if (!start || !end) return ''

    const startTime = dayjs.unix(start).utc()
    const endTime = dayjs.unix(end - 1).utc()
    const locale = i18n.language === 'cn' ? 'zh-cn' : 'en'
    
    if (locale === 'zh-cn') {
      return ` ${startTime.locale('zh-cn').format('M月DD日 HH:mm:ss')} ~ ${endTime.locale('zh-cn').format('M月DD日 HH:mm:ss')} (UTC)`
    }
    
    return ` ${startTime.locale('en').format('DD MMM. HH:mm:ss')} ~ ${endTime.locale('en').format('DD MMM. HH:mm:ss')} (UTC)`
  }, [timeRange, i18n.language])
  const getTradeRaceData = () => {
    getTradeRace({}).then((res) => {
      if (res.status === 200 && res.data.status === 200 && res.data.data.top_n && res.data.data.top_n.length > 0) {
        const dealList = addRankToList(res.data.data.top_n, res.data.data.total)
        // 这样做是为了防止用户连接钱包之后 两个请求前后发出，带address的先返回数据，ranklist 被不带address的数据覆盖了
        setRanklist(pre => {
          if (pre.length > 0) {
            return pre
          }
          return dealList
        })
        setTotal(res.data.data.total)
        setFee(res.data.data.fee)
        setTradeFeeThisWeek(res.data.data.trade_total_this_week)
        // Set nonce if available in response
        if (res.data.data.nonce) {
          setNonce(res.data.data.nonce)
        }
        // Set time range if available in response
        if (res.data.data.range && Array.isArray(res.data.data.range) && res.data.data.range.length === 2) {
          setTimeRange(res.data.data.range)
        }
      }
    })
  }
  const getAirdropDataInterval = () => {
    getTradeRace({}).then((res) => {
      if (res.status === 200 && res.data.status === 200 && res.data.data.fee) {
        setFee(res.data.data.fee)
      }
    })
  }
  // 定义定时器启动和清除函数
  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      getAirdropDataInterval()
    }, 20000)
  }
  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    // 首次加载，带 address（如果有）
    if (account) {
      getDataByAddress(account)
    } else {
      getTradeRaceData()
    }

  }, [account])
  useEffect(() => {
    if (account) {
      setCurrentAccount(account)
      searchRef.current?.reset()
    }
  }, [account])

  useEffect(() => {
    // interval 只更新 fee
    startInterval()
    // 监听 focus/unfocus
    const handleFocus = () => {
      console.log('focus')
      getAirdropDataInterval()
      startInterval()
    }
    const handleBlur = () => {
      clearTimer()
    }
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      clearTimer()
      console.log('destroy')
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return (
    <div style={{ background: '#fff', padding: 24, minHeight: '100vh' }}>
      <Card bordered={false} style={{ margin: '0 auto', maxWidth: 900 }}>
        <div className="flex items-center justify-center gap-2">
          <Title level={3} style={{ marginBottom: 0 }}>
            {t('trade_race_title')}
          </Title>
          {nonce > 0 && (
            <div
              style={{
                backgroundColor: '#FFE8B2',
                border: '1px solid #E2B201',
                borderRadius: '16px',
                padding: '2px 16px',
                display: 'inline-flex',
                alignItems: 'center',
                height: '32px',
                color: '#D48806',
                fontSize: 20,
                lineHeight: '28px',
                fontWeight: 700
              }}
            >
              #{nonce}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', color: '#E2B201', margin: '8px 0' }}>
          <Text strong>⏰ {t('trade_race_time')}</Text>
          {formatTimeRange}
        </div>
        <div className="break-all" style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
          <div className="font-bold text-[14px]">📊 {t('trade_race_rule_title')}</div>
          <div>📌 {t('trade_race_rule_desc1')}</div>
          <div>{t('trade_race_rule_desc2')}</div>
          <div>🥇<Trans 
              i18nKey="trade_race_rule_desc3"
              components={{
                strong: <strong style={{ color: '#ffc801', fontWeight: 'bold',fontSize: '16px' }} />
              }}
              values={{
                rate: fee?.ratio / 10
              }}
            />{t('trade_race_rule_desc4')}</div>
          <div>
            🎯
            <Trans 
              i18nKey="trade_race_rule_desc5"
              components={{
                strong: <strong style={{ color: '#ffc801', fontWeight: 'bold',fontSize: '16px' }} />
              }}
            />
          </div>
          <div>❗️{t('trade_race_note_desc2')}</div>
        </div>
        <div className="break-all" style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
          <div className="font-bold text-[14px]">🎁 {t('trade_race_reward_title')}</div>
          <div>•{t('trade_race_reward_desc1')}</div>
          <div>•{t('trade_race_reward_desc2')}</div>
          <div>•{t('trade_race_reward_desc4')}</div>
        </div>
        <div className="flex justify-center mb-6">
          <Button 
            type="primary" 
            onClick={() => {
              setAddressSearchModalVisible(true)
            }}
            style={{
              background: '#ffc801',
              border: 'none',
              borderRadius: '25px',
              height: '40px',
              padding: '0 24px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(226, 178, 1, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(226, 178, 1, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(226, 178, 1, 0.3)'
            }}
          >
            <span style={{ fontSize: '18px' }}>🍭</span>
            {t('search_address')}
          </Button>
        </div>
        <Divider />
        {fee?.airdrop_usdt_amount && <div className="flex justify-around md:flex-row flex-col items-start md:items-center mb-[24px]">
          <div className='w-[33%] text-center'>
            <Text>{t('trade_race_total_volume')}</Text>
            <div style={{ fontSize: 22, color: '#E2B201', fontWeight: 700 }}>${formatNumber(tradeFeeThisWeek)}</div>
          </div>
          <div className='w-[33%] text-center'>
            <Text>{t('trade_race_current_reward')}</Text>
            {/* <div style={{ fontSize: 22, color: '#E2B201', fontWeight: 700 }}>${formatNumber(+fee?.usdt_amount * ratio)}</div> */}
            <div style={{ fontSize: 22, color: '#E2B201', fontWeight: 700 }}>
              $<OdometerNumber 
                value={+fee?.airdrop_usdt_amount} 
                firstAppear={true}
              />
              (<OdometerNumber value={+fee?.airdrop_koge_amount} firstAppear={true} />KOGE)
            </div>
          </div>
          <div className='w-[33%] text-center'>
            <Text>{t('trade_race_eligible_volume')}</Text>
            <div style={{ fontSize: 22, color: '#E2B201', fontWeight: 700 }}>${formatNumber(lastRankDetail?.usdt_amount)}</div>
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
        <div className=' mb-[16px]'>
          <div className='flex items-center flex-wrap'>
            <Title level={4} style={{ margin: '0 10px 0 0' }}>
              {t('trade_race_leaderboard_title')}
            </Title>
            { fee?.lastupdate && <div className='mr-[10px]'> {t('trade_race_lastupdate')}: {dayjs(fee.lastupdate * 1000).format('YYYY-MM-DD HH:mm:ss')}</div> }
            {currentAccount && <a className="underline decoration-[#e2b201]" href={`#${currentAccount}`}><Text style={{ color: '#E2B201' }}>{t('trade_race_my_volume')}：{userRank?.usdt_amount}</Text></a>}
          </div>
          <div className='flex items-center gap-2 justify-between mt-[16px]'>
            <AddressSearch onSearch={handleSearch} ref={searchRef} />
          </div>
          
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
                  id={rank.address}
                >
                  {
                    columns.map((column, columnIndex) => {
                      return columnIndex <= 0 ? (<div key={column.key} className='font-bold' style={{ margin: '8px 0', color: '#333' }}>
                        <span>{column.render?.(rank[column.dataIndex || ''], rank, index)}</span>
                      </div>) : (<div className='flex' key={column.key} style={{ margin: '8px 0', color: '#333' }}>
                        <span className={`${getClass(rank)}`} style={{ fontWeight: 500 }}>{column.title}：</span>
                        <span className='word-break-all'>{column.render?.(rank[column.dataIndex || ''], rank, index)}</span>
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
        {/* <Divider /> */}
        {/* <div style={{ color: '#888', fontSize: 13 }}>
          <div>❗️{t('trade_race_note_title')}</div>
          <div>• {t('trade_race_note_desc1')}</div>
          <div>• {t('trade_race_note_desc2')}</div>
          <div>• {t('trade_race_note_desc3')}</div>
        </div> */}
      </Card>
      <AddressSearchModal visible={addressSearchModalVisible} onClose={() => setAddressSearchModalVisible(!addressSearchModalVisible)} />
    </div>
  )
}
