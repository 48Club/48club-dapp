import { Col, Row } from 'antd'
import ActivityListCard from './ActivityListCard'
import './index.less'
import { useTranslation } from 'react-i18next'

const REVIEW_ITEMS = [{
  id: 1,
  title: 'home_page_activity_section_title_1',
  content: 'home_page_activity_section_content_1',
  image_url: '/static/illustration-home-activity-1-updated.png',
}, {
  id: 2,
  title: 'home_page_activity_section_title_2',
  content: 'home_page_activity_section_content_2',
  image_url: '/static/illustration-home-activity-2.png',
}]

export default function ActivitySection() {
  const { t } = useTranslation()

  return (
    <div className="activity-section mx-auto">
      <div className="container">
        <div className="section-header">
          <div className="section-title">
            {t('home_page_activity_section_title')}
          </div>
          <div className="section-content">
            <Row gutter={24}>
              {
                REVIEW_ITEMS.map(item => (
                  <Col xs={24} md={12} key={`activity-list-card-${item.id}`}>
                    <ActivityListCard
                      item={{
                        ...item,
                        title: t(item.title),
                        content: t(item.content),
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
