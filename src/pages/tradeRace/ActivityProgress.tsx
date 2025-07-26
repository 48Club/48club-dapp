import React from 'react'

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
  const days: DayInfo[] = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    minVolume: (i + 1) * n
  }))
  const finalVolume = 7 * n
  const renderMyVolume = () => {
    return +myVolume >= +dayVolume
      ? badge(true, '今日已达标 ✔')
      : badge(false, '今日暂未达标 ✘, 请继续加油')
  }
  const renderFinalVolume = () => {
    return +myVolume >= +finalVolume
      ? badge(true, '本周已达标 ✔')
      : (<>{badge(false, '本周暂未达标 ✘, 请继续加油')}</>)
  }
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 32, margin: '0 auto', boxShadow: '0 4px 24px #0001' }}>
      {/* 进度条 */}
      <div style={{ display: 'flex', marginBottom: 32, position: 'relative', height: 90, borderRadius: 16, alignItems: 'flex-end', padding: '0 8px' }}>
        {days.map((d, idx) => (
          <div key={d.day} style={{
            flex: 1,
            marginRight: idx < 6 ? 6 : 0,
            background: idx < currentDay ? 'linear-gradient(180deg,#ffe066,#ffd829)' : '#f5f5f5',
            border: idx + 1 === currentDay ? '2.5px solid #E2B201' : '1px solid #FFD829',
            borderRadius: idx === 0 ? '12px 0 0 12px' : idx === 6 ? '0 12px 12px 0' : 0,
            position: 'relative',
            height: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 1,
            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
          }}>
            <span style={{ fontSize: 13, color: '#888', marginTop: 2 }}>第{d.day}天</span>
          </div>
        ))}
        {/* 当前天的高亮标记箭头 */}
        <div style={{
          position: 'absolute',
          left: `${(currentDay - 0.5) * 100 / 7}%`,
          transform: 'translateX(-50%)',
          top: 24,
          zIndex: 2
        }}>
          <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '16px solid #E2B201' }}></div>
        </div>
      </div>
      {/* 我的交易量与今日标准 */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        {
          myVolume && (
            <div style={{ fontSize: 20, fontWeight: 700, color: '#222', marginBottom: 6 }}>我的当前交易量：{myVolume} USDT</div> 
          )
        }
        {+myVolume < +finalVolume && (
          <div style={{ fontSize: 17, margin: '8px 0', color: '#7c5c00', fontWeight: 600 }}>
            今日入围标准：{dayVolume} USDT
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
        fontSize: 18,
        color: '#7c5c00',
        marginTop: 12,
        boxShadow: '0 2px 8px #ffd82933'
      }}>
        本周入围标准：{finalVolume} USDT
        <div style={{ fontSize: 16, margin: '8px 0', color: '#222', fontWeight: 600 }}>
          {myVolume !== null && renderFinalVolume()}
        </div>
      </div>
    </div>
  )
}

export default ActivityProgress 