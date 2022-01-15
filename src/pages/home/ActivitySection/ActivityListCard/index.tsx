import React from 'react'
import './index.less'

export default function ActivityListCard(props: { item: any }) {
  const { item } = props
  if (!item) {
    return null
  }
  return (
    <div className="activity-list-card">
      <div
        className="activity-profile-image"
        style={{
          backgroundImage: `url(${item.image_url})`,
        }}
      />
      <div className="activity-title">
        {item.title}
      </div>
      <div className="activity-content">
        {item.content}
      </div>
    </div>
  )

}
