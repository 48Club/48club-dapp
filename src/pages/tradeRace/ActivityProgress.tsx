import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { ApplicationModal } from '@/state/application/actions'
import { useOpenModal } from '@/state/application/hooks'

interface DayInfo {
  day: number
  minVolume: number
}

interface ActivityProgressProps {
  n: number // 最小基准
  myVolume: number // 我的当前交易量
  currentDay: number // 今天是第几天（1-7）
  dayVolume: number // 每日入围交易量
}

const badge = (ok: boolean, text: string) => (
  <span style={{
    display: 'inline-block',
    background: ok ? 'linear-gradient(90deg,#b7f5c6,#4ade80)' : 'linear-gradient(90deg,#f8d7da,#f5c6cb)',
    color: ok ? '#15803d' : '#a94442',
    borderRadius: 16,
    padding: '2px 12px',
    fontWeight: 700,
    fontSize: 14,
    marginLeft: 12,
    boxShadow: ok ? '0 2px 8px #4ade8055' : '0 2px 8px #f8d7da55',
    verticalAlign: 'middle'
  }}>{text}</span>
)

const ActivityProgress: React.FC<ActivityProgressProps> = ({ n, myVolume, currentDay, dayVolume }) => {
  const openwallet = useOpenModal(ApplicationModal.WALLET)
  const { t } = useTranslation()
  const days: DayInfo[] = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    minVolume: (i + 1) * n
  }))
  const finalVolume = 7 * n
  const renderMyVolume = () => {
    return +myVolume >= +dayVolume
      ? badge(true, t('trade.today_achieved'))
      : badge(false, t('trade.today_not_achieved'))
  }
  const renderFinalVolume = () => {
    return +myVolume >= +finalVolume
      ? badge(true, t('trade.week_achieved'))
      : (<>{badge(false, t('trade.week_not_achieved'))}</>)
  }
  return (
    <div style={{ background: '#fff', padding: '0px 0', margin: '0 auto' }}>
      {/* 进度条 */}
      <div style={{ display: 'flex', marginBottom: 12, position: 'relative', height: 75, borderRadius: 16, alignItems: 'flex-end', padding: '0 8px' }}>
        {days.map((d, idx) => (
          <div key={d.day} style={{
            flex: 1,
            marginRight: idx < 6 ? 6 : 0,
            background: idx < currentDay ? 'linear-gradient(180deg,#ffe066,#ffd829)' : '#f5f5f5',
            border: idx + 1 === currentDay ? '2.5px solid #E2B201' : '1px solid #FFD829',
            borderRadius: idx === 0 ? '12px 0 0 12px' : idx === 6 ? '0 12px 12px 0' : 0,
            position: 'relative',
            height: 48,
            lineHeight: '44px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 1,
            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
          }}>
            <span style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{t('trade.day')} {d.day}</span>
          </div>
        ))}
        {/* 当前天的高亮标记箭头 */}
        <div style={{
          position: 'absolute',
          left: `${(currentDay - 0.5) * 100 / 7}%`,
          transform: 'translateX(-50%)',
          top: 10,
          zIndex: 2
        }}>
          <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '16px solid #E2B201' }}></div>
        </div>
      </div>
      <div className='relative'>
        {/* 我的交易量与今日标准 */}
        <div style={{ marginBottom: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#222', marginBottom: 6 }}>{t('trade.my_current_volume')}：{myVolume} USDT</div> 
          {+myVolume < +finalVolume && (
            <div style={{ fontSize: 14, margin: '8px 0', color: '#7c5c00', fontWeight: 600 }}>
              {t('trade.today_qualifying_standard')}：{dayVolume} USDT
              {myVolume !== null && renderMyVolume()}
            </div>
          )}
        </div>
        
        {/* 最终标准 */}
        <div style={{
          background: 'linear-gradient(90deg,#ffe066,#ffd829 60%,#fffbe6)',
          borderRadius: 12,
          padding: 18,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 14,
          color: '#7c5c00',
          marginTop: 12,
          boxShadow: '0 2px 8px #ffd82933'
        }}>
          {t('trade.week_qualifying_standard')}：{finalVolume} USDT
          <div style={{ fontSize: 14, margin: '8px 0', color: '#222', fontWeight: 600 }}>
            {renderFinalVolume()}
          </div>

        </div>
        {
          myVolume === undefined && (<>
          <div className='absolute top-0 left-0 w-full h-full'></div>
          <div className='absolute top-0 left-0 w-full h-full bg-white bg-opacity-95 flex items-center justify-center rounded-lg'>
            <Button type='primary' style={{ fontSize: 14, color: '#666', fontWeight: 500 }} onClick={openwallet}>
              {t('trade.connect_wallet')}
            </Button>
          </div>
          </>)
        }
      </div>
      
      
    </div>
  )
}

export default ActivityProgress 