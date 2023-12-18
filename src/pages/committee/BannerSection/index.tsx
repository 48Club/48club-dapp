import { Col, Row } from 'antd'
import './index.less'
import { useTranslation } from 'react-i18next'

export default function BannerSection() {
  const { t } = useTranslation()

  return (
    <div className="banner-section">
      <div className="container">
        <Row>
          <Col xs={24} md={24}>
            <div className="section-content">
              <div className="section-title">
                48 Club®
                <br />
                {t('app_header_menu_committee_title')}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
