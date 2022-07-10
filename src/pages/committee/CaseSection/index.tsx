import React from 'react'
import { Col, Row } from 'antd'
import CaseListCard from './CaseListCard'
import './index.less'
import { useTranslation } from 'react-i18next'

const REVIEW_ITEMS = [{
  id: 1,
  title: 'committee_page_case_section_title_1',
  content: 'committee_page_case_section_content_1',
  image_url: 'https://img-oss.bnb48.club/oss/illustration-governance-graphic-1.png',
}, {
  id: 2,
  title: 'committee_page_case_section_title_2',
  content: 'committee_page_case_section_content_2',
  image_url: 'https://img-oss.bnb48.club/oss/illustration-governance-graphic-2.png',
}, {
  id: 2,
  title: 'committee_page_case_section_title_3',
  content: 'committee_page_case_section_content_3',
  image_url: 'https://img-oss.bnb48.club/oss/illustration-governance-graphic-3.png',
}]

export default function CaseSection() {
  const { t } = useTranslation()

  return (
    <div className="case-section">
      <div className="container">
        <div className="section-header">
          <div className="section-content">
            <Row gutter={24} align="top">
              {
                REVIEW_ITEMS.map(item => (
                  <Col xs={24} md={8} key={`case-list-card-${item.id}`}>
                    <CaseListCard
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
