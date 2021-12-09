import React from 'react'
import { Col, Row } from 'antd'
import './index.less'

export default function BannerSection() {
  return (
    <div className='banner-section'>
      <div className='background-container'>
        <Row>
          <Col xs={0} md={18} offset={6}>
            <div className='background-cover' />
          </Col>
        </Row>
      </div>
      <div className='container'>
        <Row>
          <Col xs={24} md={10}>
            <div className='section-content'>
              <div className='section-title'>
                {'home_page_banner_section_title_1'}
                <br />
                {'home_page_banner_section_title_2'}
              </div>
              <div className='section-subtitle'>
                {'home_page_banner_section_subtitle_1'}
                <p>
                  {'home_page_banner_section_subtitle_2'}
                </p>
                <div>
                  <a
                    className='button'
                    href={
                      'https://drive.google.com/file/d/1NFZiOoILO59LemFn2-_LHMD7c3nDBHla/view?usp=sharing'
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {'home_page_banner_section_whitepaper_button_title'}
                  </a>
                </div>
                {/* {intl.formatMessage({ id: 'home_page_banner_section_subtitle' })} */}
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Row>
        <Col xs={24} md={0}>
          <div className='section-cover'>
            <img src='https://bnb48club-prod.oss-accelerate.aliyuncs.com/illustration-home-banner.png' alt='BNB48Club' />
          </div>
        </Col>
      </Row>
    </div>
  )
}

