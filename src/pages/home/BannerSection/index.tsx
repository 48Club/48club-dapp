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
                BNB48 Club®
                <br />
                币安智能链(BSC)上的 DAO
              </div>
              <div className='section-subtitle'>
                BNB48 Club®起源于2018年春天，创始成员是一群在接触BNB的过程中产生共鸣的投资者。现成员分布超过500人，分布在全球各地，是一个非常多元化与国际化的BNB社区。BNB48 Club®以去中心化自治组织（DAO）的形式运行，围绕币安链/币安智能链/BNB进行包括但不限于行业研究、天使投资、社区拓展、产品开发、节点建设等活动。
                <p>
                  BNB48是BNB的社区成员，币安是BNB的发行者。两者不具有任何意义上的从属关系。
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
                    KOGE白皮书
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

