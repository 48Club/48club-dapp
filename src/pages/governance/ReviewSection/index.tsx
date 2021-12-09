import React from 'react'
import { Col, Row } from 'antd'
import ReviewListCard from './ReviewListCard'
import './index.less'

const REVIEW_ITEMS = [
  {
    title: 'Dominator008',
    subtitle: 'dominator008@bnb48.club',
    telegram: 'Dominator008',
  },
  {
    title: 'Gui',
    subtitle: 'gui@bnb48.club',
    telegram: 'gscoin',
  },
  {
    title: 'HelloWorld',
    subtitle: 'hw@bnb48.club',
    telegram: 'hongp',
  },
  {
    title: 'Hutian280',
    subtitle: 'hu@bnb48.club',
    telegram: 'hutian280',
  },
  {
    title: 'Ian',
    subtitle: 'sirian@bnb48.club',
    telegram: 'SirIanM',
  },
  {
    title: 'Jerry',
    subtitle: 'jerry@bnb48.club',
    telegram: 'JerryZhou',
  },
  {
    title: 'Mao',
    subtitle: 'mao@bnb48.club',
    telegram: 'heymattbkk',
  },
  {
    title: 'Mars',
    subtitle: 'mars@bnb48.club',
    telegram: 'Brun0Mars',
  },
  {
    title: 'Orca',
    subtitle: 'orca@bnb48.club',
    telegram: 'orcinuslaorca',
  },
  {
    title: 'Yoyo',
    subtitle: 'yoyo@bnb48.club',
    telegram: 'supremacy2018',
  },
  {
    title: '大麦',
    subtitle: 'damal@bnb48.club',
    telegram: 'BigMaimai',
  },
  {
    title: '千年韭菜',
    subtitle: 'qian@bnb48.club',
    telegram: 'qianjiu000',
  },
]

export default function ReviewSection() {
  return (
    <div className='review-section'>
      <div className='container'>
        <div className='section-header'>
          <div className='section-title'>
            {'governance_page_review_section_title'}
          </div>
          <div className='section-subtitle'>
            {'governance_page_review_section_subtitle'}
          </div>
          <div className='section-content'>
            <Row gutter={24}>
              {
                REVIEW_ITEMS.map(item => (
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
