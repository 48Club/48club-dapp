import React from 'react'
import { Col, Row } from 'antd'
import ActivityListCard from './ActivityListCard'
import './index.less'

const REVIEW_ITEMS = [{
  id: 1,
  title: 'home_page_activity_section_title_1',
  content: 'home_page_activity_section_content_1',
  image_url: 'https://bnb48club-prod.oss-accelerate.aliyuncs.com/illustration-home-activity-1-updated.png',
}, {
  id: 2,
  title: 'home_page_activity_section_title_2',
  content: 'home_page_activity_section_content_2',
  image_url: 'https://bnb48club-prod.oss-accelerate.aliyuncs.com/illustration-home-activity-2.png',
}]

export default function ActivitySection() {

  return (
    <div className='activity-section'>
      <div className='container'>
        <div className='section-header'>
          <div className='section-title'>
            {'home_page_activity_section_title'}
          </div>
          {/* <div className='section-subtitle'>
              Our clients reach out to us for different kinds of writing, but all with the goal of improving their copy.
                  {intl.formatMessage({ id: 'home_page_banner_section_subtitle' })}
            </div> */}
          <div className='section-content'>
            <Row gutter={24}>
              {
                REVIEW_ITEMS.map(item => (
                  <Col xs={24} md={12} key={`activity-list-card-${item.id}`}>
                    <ActivityListCard
                      item={{
                        ...item,
                        title:  item.title,
                        content: item.content,
                      }}
                    />
                  </Col>
                ))
              }
            </Row>
          </div>
        </div>
      </div>
    </div>
  )
}
