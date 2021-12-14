import React from 'react'
import { Col, Row } from 'antd'
import ActivityListCard from './ActivityListCard'
import './index.less'

const REVIEW_ITEMS = [{
  id: 1,
  title: '节点建设',
  content: 'BNB48 Club®会积极参与币安智能链生态/Cosmos生态的节点建设，目前BNB48已经是Kava的第21大节点，未来计划竞选币安智能链（BSC）节点，SwingBy节点等等。',
  image_url: 'https://bnb48club-prod.oss-accelerate.aliyuncs.com/illustration-home-activity-1-updated.png',
}, {
  id: 2,
  title: 'BNB48 Club® Treasury',
  content: 'BNB48 Club® Treasury 除维护BNB48 Club的日常运营开支外，也进行关于币安链生态 项目的天使投资、孵化，以及参与BNB生态Yield Farming、二级市场项目等。俱乐部Treasury定期向俱乐部成员公布资产明细。',
  image_url: 'https://bnb48club-prod.oss-accelerate.aliyuncs.com/illustration-home-activity-2.png',
}]

export default function ActivitySection() {

  return (
    <div className='activity-section mx-auto'>
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
