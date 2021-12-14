import React from 'react'
import { Col, Row } from 'antd'
import { LockOutlined, WechatOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.less'
import appLogo from '../../assets/images/icon/logo-app.svg'

export default function Footer() {
  const language = 'en'
  return (
    <footer className='app-footer'>
      <div className='seperator' />
      <div className='container'>
        <div className='website-link'>
          <Row gutter={48} align='top'>
            <Col xs={24} md={6}>
              <div className='website-info'>
                <img
                  className='app-logo'
                  src={appLogo}
                  alt='BNB48 Club'
                />
                <div className='copyright'>
                  {'app_og_description'}
                  <br />
                  <br />
                  © 2020 BNB48 Club®
                </div>
                <div className='security'>
                  <LockOutlined />
                  <div>{'app_footer_website_info_security'}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div className='widget'>
                <div className='title'>
                  {'app_footer_website_section_title'}
                </div>
                <ul>
                  <li>
                    <Link to='/'>
                      <a>{'app_header_menu_home_title'}</a>
                    </Link>
                  </li>
                  <li>
                    <Link to='/governance'>
                      <a>{'app_header_menu_governance_title'}</a>
                    </Link>
                  </li>
                  <li>
                    <Link to='/validation_node'>
                      <a>{'app_header_menu_node_title'}</a>
                    </Link>
                  </li>
                  <li>
                    <Link to='/milestone'>
                      <a>{'app_header_menu_milestone_title'}</a>
                    </Link>
                  </li>
                  <li>
                    <a
                      className='app-button'
                      href={
                        language === 'en'
                          ? 'https://drive.google.com/file/d/1RZxJamk3dK2w-4e4TI98uXe1bCLd2Vz1/view?usp=sharing'
                          : 'https://drive.google.com/file/d/1NFZiOoILO59LemFn2-_LHMD7c3nDBHla/view?usp=sharing'
                      }
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {'app_header_menu_whitepaper_title'}
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div className='widget'>
                <div className='title'>
                  {'app_footer_social_section_title'}
                </div>
                <ul>
                  <li>
                    <a className='flex flex-row items-center' href='https://twitter.com/bnb48club' target='_blank' rel='noopener noreferrer'>
                      <img className='social-icon' src='/static/icon-social-twitter.svg' alt='Twitter' />
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a className='flex flex-row items-center' href='https://weibo.com/bnb48sirian' target='_blank' rel='noopener noreferrer'>
                      <img className='social-icon' src='/static/icon-social-weibo.png' alt='Weibo' />
                      {'app_footer_item_weibo' }
                    </a>
                  </li>
                  <li>
                    <a className='flex flex-row items-center' href='https://t.me/bnb48club_cn' target='_blank' rel='noopener noreferrer'>
                      <img className='social-icon' src='/static/icon-social-telegram.png' alt='Telegram' />
                      {/* {intl.formatMessage({ id: 'app_footer_social_section_item_facebook' })} */}
                      Telegram
                    </a>
                  </li>
                  <li>
                    <a className='flex flex-row items-center' href='https://github.com/BNB48Club' target='_blank' rel='noopener noreferrer'>
                      <img className='social-icon' src='/static/icon-social-github.png' alt='Github' />
                      Github
                    </a>
                  </li>
                  <li>
                    <a className='flex flex-row items-center' href='https://discord.gg/FzA9Pzr' target='_blank' rel='noopener noreferrer'>
                      <img className='social-icon' src='/static/icon-social-discord.png' alt='Discord' />
                      Discord
                    </a>
                  </li>
                  <li>
                    <a className='flex flex-row items-center' href='https://medium.com/bnb48-club-publish' target='_blank' rel='noopener noreferrer'>
                      <img className='social-icon' src='/static/icon-social-medium.png' alt='Medium' />
                      Medium
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div className='widget'>
                <div className='title'>
                  {/*<Icon type='wechat' style={{ marginRight: '3px' }} />*/}
                  <WechatOutlined />
                  {'app_footer_wechat_section_title'}
                </div>
                <img src='/static/BNB48_二维码.png' alt='WeChat' style={{ height: '100px', marginBottom: '24px' }} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  )
}
