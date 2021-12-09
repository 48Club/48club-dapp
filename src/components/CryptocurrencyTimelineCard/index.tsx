import React from 'react'

import './index.less'

export default function ReportListCard(props: { item: any }) {
  const {
    item,
  } = props
  if (!item) {
    return null
  }
  return (
    <div className='cryptocurrency-timeline-card'>
      <div className='dot' />
      <div className='content'>
        <div className='item-main'>
          <div className='item-subtitle'>
            {item.event_title}
          </div>
          <div className='item-title'>
            <div>{(item.event_content || '').trim() || ''}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
