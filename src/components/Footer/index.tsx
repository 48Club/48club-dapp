import { Col, Row } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.less'
import appLogo from '../../assets/images/icon/logo-app.svg'
import { useTranslation } from 'react-i18next'
import { DISCORD_URL, GITHUB_URL, MEDIUM_URL, TWITTER_URL } from '../../constants/48club'
import { switchChain } from '@/constants/chain'

export default function Footer() {
  const { t } = useTranslation()

  // const language = localStorage.getItem('language')

  return (
    <footer className="app-footer">
      <div className="seperator" />
      <div className="container">
        <div className="website-link">
          <Row gutter={48} align="top">
            <Col xs={24} md={8}>
              <div className="website-info">
                <img
                  className="app-logo"
                  src={appLogo}
                  alt="48 Club"
                />
                <div className="copyright">
                  {t('app_og_description')}
                  <br />
                  <br />
                  © 2022 48 Club®
                </div>
                <div className="security">
                  <LockOutlined />
                  <div>{t('app_footer_website_info_security')}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="widget">
                <div className="title">
                  {t('app_footer_website_section_title')}
                </div>
                <ul>
                  <li>
                    <Link to="/">
                      {t('app_header_menu_home_title')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/committee">
                      {t('app_header_menu_committee_title')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/validation_node">
                      {t('app_header_menu_node_title')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/milestone">
                      {t('app_header_menu_milestone_title')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/staking">
                      {t('nav-staking')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/nft">
                      {t('nav-nft')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/voting">
                      {t('nav-voting')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/pool">
                      {t('nav-farm')}
                    </Link>
                  </li>
                  <li>
                    <a
                      className="app-button"
                      href="https://docs.48.club"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('app_header_menu_docs_title')}
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="widget">
                <div className="title">
                  {t('app_footer_social_section_title')}
                </div>
                <ul>
                  <li>
                    <a className="flex flex-row items-center" href={TWITTER_URL} target="_blank" rel="noopener noreferrer">
                      <img className="social-icon" src="/static/icon-social-twitter.svg" alt="Twitter" />
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a className="flex flex-row items-center" href={t('telegram_invite_href')} target="_blank" rel="noopener noreferrer">
                      <img className="social-icon" src="/static/icon-social-telegram.png" alt="Telegram" />
                      Telegram
                    </a>
                  </li>
                  <li>
                    <a className="flex flex-row items-center" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                      <img className="social-icon" src="/static/icon-social-github.png" alt="Github" />
                      Github
                    </a>
                  </li>
                  <li>
                    <a className="flex flex-row items-center" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                      <img className="social-icon" src="/static/icon-social-discord.png" alt="Discord" />
                      Discord
                    </a>
                  </li>
                  <li>
                    <a className="flex flex-row items-center" href={MEDIUM_URL} target="_blank" rel="noopener noreferrer">
                      <img className="social-icon" src="/static/icon-social-medium.png" alt="Medium" />
                      Medium
                    </a>
                  </li>
                </ul>
              </div>

              <div className="widget">
                <div className="title">
                  {t('add_48club_RPC_title')}
                </div>
                <ul>
                  <li>
                    <a className="flex flex-row items-center" onClick={() => { switchChain('Default', true) }} rel="noopener noreferrer">
                      <img className="social-icon" src="/static/chain.svg" alt="1Gwei" />
                      https://rpc.48.club
                    </a>
                  </li>
                  <li>
                    <a className="flex flex-row items-center" onClick={() => { switchChain('0Ggei', true) }} rel="noopener noreferrer">
                      <img className="social-icon" src="/static/chain.svg" alt="0Gwei" />
                      https://0.48.club (Soul&gt;=48)
                    </a>
                  </li>

                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  )
}
