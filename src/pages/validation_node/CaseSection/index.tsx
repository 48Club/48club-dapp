import React from 'react'
import { Col, Row } from 'antd'
import CaseListCard from './CaseListCard'
import './index.less'

const REVIEW_ITEMS = [{
  id: 1,
  title: 'BNB48Club',
  content: 'https://kava.mintscan.io/validators/kavavaloper1nhcvgj0j7mrvrat3dfhudpypaqn00eaf2dh0gp',
  image_url: 'https://bnb48club-prod.oss-accelerate.aliyuncs.com/logo-partner-kava.svg',
}]

export default function CaseSection() {
  return (
    <div className="case-section">
      <div className="container">
        <div className="section-header">
          <div className="section-content">
            <Row gutter={24}>
              {
                REVIEW_ITEMS.map(item => (
                  <Col xs={24} md={24} key={`case-list-card-${item.id}`}>
                    <CaseListCard item={item} />
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
