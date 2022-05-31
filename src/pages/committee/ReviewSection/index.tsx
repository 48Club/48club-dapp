import React from 'react'
import { Col, Row } from 'antd'
import ReviewListCard from './ReviewListCard'
import './index.less'
import { useTranslation } from 'react-i18next'
import { COMMITTEE_LIST } from '../../../constants/bnb48'

export default function ReviewSection() {
  const { t } = useTranslation()

  return (
    <div className="review-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title">
            {t('committee_page_review_section_title')}
          </div>
          <div className="section-subtitle">
            {t('committee_page_review_section_subtitle')}
          </div>
          <div className="section-content">
            <Row gutter={24}>
              {
                COMMITTEE_LIST.map(item => (
                  <Col xs={24} md={6} key={`review-list-card-${item.title}`}>
                    <ReviewListCard item={item} />
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
