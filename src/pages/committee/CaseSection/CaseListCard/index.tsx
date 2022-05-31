import React from 'react'
import './index.less'

export default function CaseListCard(props: { item: any }) {
  const { item } = props
  if (!item) {
    return null
  }
  return (
    <div className="case-list-card">
      <div
        className="case-profile-image"
        style={{
          backgroundImage: `url(${item.image_url})`,
        }}
      />
      <div className="case-title">
        {item.title}
      </div>
      <div className="case-content">
        {item.content}
      </div>
    </div>
  )
}
