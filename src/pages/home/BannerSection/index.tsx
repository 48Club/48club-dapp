import { Col, Row } from 'antd'
import './index.less'
import { useTranslation } from 'react-i18next'

export default function BannerSection() {
  const { t } = useTranslation()
  const language = localStorage.getItem('language')
  return (
    <div className="banner-section">
      <div className="background-container">
        <Row>
          <Col xs={0} md={18} offset={6}>
            <div className="background-cover" />
          </Col>
        </Row>
      </div>
      <div className="container">
        <Row>
          <Col xs={24} md={10}>
            <div className="section-content">
              <div className="section-title">
                {t('home_page_banner_section_title_1')}
                <br />
                {t('home_page_banner_section_title_2')}
              </div>
              <div className="section-subtitle">
                {t('home_page_banner_section_subtitle_1')}
                <p>
                  {t('home_page_banner_section_subtitle_2')}
                </p>
                <div>
                  <a
                    className="button"
                    href={
                      language === 'en'
                        ? 'https://drive.google.com/file/d/1RZxJamk3dK2w-4e4TI98uXe1bCLd2Vz1/view?usp=sharing'
                        : 'https://drive.google.com/file/d/1NFZiOoILO59LemFn2-_LHMD7c3nDBHla/view?usp=sharing'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('home_page_banner_section_whitepaper_button_title')}
                  </a>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Row>
        <Col xs={24} md={0}>
          <div className="section-cover">
            <img src="/static/illustration-home-banner.png" alt="48Club" />
          </div>
        </Col>
      </Row>
    </div>
  )
}

