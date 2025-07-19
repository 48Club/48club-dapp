import React from 'react'
import { Divider, Menu, Modal } from 'antd'
import appLogo from '../../assets/images/icon/logo-app.svg'
import { useTranslation } from 'react-i18next'
import './MobileModal.less'
import { CloseOutlined } from '@ant-design/icons/lib'
import { Link } from 'react-router-dom'
import i18n from 'i18next'

const mentItemStyle = { fontSize: '12px', letterSpacing: '3px' }

export default function MobileModal(props: { open: boolean, oncancel: () => void }) {
  const { t } = useTranslation()

  const [language, setLanguage] = React.useState(localStorage.getItem('language') || 'en')
  React.useEffect(() => {
    localStorage.setItem('language', language)
    i18n.changeLanguage(language)
  }, [language])

  return (
    <Modal
      open={props.open}
      onCancel={props.oncancel}
      footer={null}
      maskClosable
      styles={{
        mask: {
          height: '100%',
        },
      }}
      width="100%"
      wrapClassName="app-responsive-menu-modal-wrapper"
    >
      <div className="modal-header">
        <div className="logo-container">
          <img className="logo-app" src={appLogo} alt="48 Club" />
        </div>
        <CloseOutlined onClick={props.oncancel} />
      </div>
      <div className="modal-content">
        <Menu
          mode="vertical"
          selectable={false}
          selectedKeys={[]}
          onClick={props.oncancel}
        >
          <Menu.Item key={`menu-item-language-en`}>
            <div className="opacity-75 hover:text-primary" style={mentItemStyle} onClick={() => setLanguage('en')}>English</div>
          </Menu.Item>
          <Menu.Item key={`menu-item-language-cn`}>
            <div className="opacity-75 hover:text-primary" style={mentItemStyle} onClick={() => setLanguage('cn')}>中文</div>
          </Menu.Item>
        </Menu>
        <Divider />
        <Menu
          className="header-menu"
          mode="vertical"
          selectable={false}
          selectedKeys={[]}
          onClick={props.oncancel}
        >
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/'}>{t('app_header_menu_home_title')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/staking'}>{t('staking')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/nft'}>{t('NFT')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/voting'}>{t('Voting')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/pool'}>{t('nav-farm')}</Link>
          </Menu.Item>
          {/* <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/gasponsor'}>GaSponsor</Link>
          </Menu.Item> */}
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/gasponsor'}>{t('gas.title')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/inscriptions'}>{t('inscriptions')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/trade-race'}>
              <img src="/static/trade-race-icon.png" className="h-[40px]" alt="" />
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/committee'}>{t('app_header_menu_committee_title')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/validation-node'}>{t('app_header_menu_node_title')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link className="text-black opacity-75 hover:text-primary" to={'/milestome'}>{t('app_header_menu_milestone_title')}</Link>
          </Menu.Item>
          <Menu.Item>
            <a className="text-black opacity-75 hover:text-primary"
              href={
                language === 'en'
                  ? 'https://drive.google.com/file/d/1RZxJamk3dK2w-4e4TI98uXe1bCLd2Vz1/view?usp=sharing'
                  : 'https://drive.google.com/file/d/1NFZiOoILO59LemFn2-_LHMD7c3nDBHla/view?usp=sharing'
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('app_header_menu_docs_title')}
            </a>
          </Menu.Item>
        </Menu>
      </div>
    </Modal>
  )
}
