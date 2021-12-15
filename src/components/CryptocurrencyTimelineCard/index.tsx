import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

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
            <ReactMarkdown children={(item.event_content || '').trim()} rehypePlugins={[rehypeRaw]}  />
            </div>
        </div>
      </div>
    </div>
  )
}
