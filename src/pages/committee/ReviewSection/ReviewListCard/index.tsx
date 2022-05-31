import React from 'react'
import { MailOutlined } from '@ant-design/icons'
import './index.less'

export default function ReviewListCard(props: { item: any }) {
  const { item } = props
  if (!item) {
    return null
  }
  return (
    <div className="review-list-card">
      <div className="review-user-part">
        {/* <div
            className='review-user-profile-image'
            style={{
              backgroundImage: `url(${item.profile_image_url})`,
            }}
          /> */}
        <div className="review-user-title-part">
          <div className="review-user-title">
            {item.title}
          </div>
          <div className="review-user-email">
            <MailOutlined />
            <a href={`mailto:${item.subtitle}`}>{item.subtitle}</a>
          </div>
          <div className="review-user-telegram">
            <a className="flex flex-row items-center" href={`https://t.me/${item.telegram}`} target="_blank" rel="noopener noreferrer">
              <img src="/static/logo-contact-tg.png" alt="Telegram" />{item.telegram}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
