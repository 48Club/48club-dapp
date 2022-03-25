import React from 'react'
import { Col, Row } from 'antd'
import './index.less'
import { useTranslation } from 'react-i18next'

const LOGO_URLS = [
  'logo-partner-binance-smart-chain.svg',
  'logo-partner-dodo.svg',
  'logo-partner-kava.svg',
  'logo-partner-swingby.svg',
  'logo-partner-mathwallet.svg',
  'logo-partner-roostoo.svg',
  'logo-partner-12.jpeg',
  'logo-partner-realsatoshi.png',
  'logo-partner-defi-labs.svg',
  'mayor-capital.svg',
  'mugglepay-logo.png',
  '/static/logo1.png',
  '/static/cnm.png',
]

export default function CustomerSection() {
  const { t } = useTranslation()

  return (
    <div className="customer-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title">
            {t('home_page_partner_section_subtitle')}
          </div>
          <div className="section-subtitle">
            {/* Join 7,327+ entrepreneurs, instructors, startups, and big corporations worldwide who are already enjoying full access + free lifetime updates. */}
            {/* {intl.formatMessage({ id: 'home_page_banner_section_subtitle' })} */}
          </div>
          <div className="section-content">
            <Row gutter={24} align="stretch">
              {
                LOGO_URLS.map(url => (
                  <Col xs={12} md={6} key={`partner-logo-${url}`}>
                    <div className="customer-list-card">
                      <img src={url.startsWith('/static') ? url : `https://bnb48club-prod.oss-accelerate.aliyuncs.com/${url}`} alt="合作伙伴" />
                    </div>
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

