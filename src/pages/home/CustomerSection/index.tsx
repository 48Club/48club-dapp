import { Col, Row } from 'antd'
import './index.less'
import { useTranslation } from 'react-i18next'
import { PARTNER_URLS } from '../../../constants/48club'


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
                PARTNER_URLS.map(url => (
                  <Col xs={12} md={6} key={`partner-logo-${url}`}>
                    <div className="customer-list-card">
                      <img src={
                        url
                        /* (url.startsWith('/static') || url.startsWith('http')) ?
                          url :
                          `https://www.48.club/static/${url}`
                        */
                      } alt="合作伙伴" />
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

