import React from 'react'
import { Link } from 'react-router-dom'
import appLogo from '../../assets/images/icon/logo-app.svg'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import MobileModal from './MobileModal'
import { CloseOutlined, MenuOutlined } from '@ant-design/icons'

export default function Header() {
  const { t } = useTranslation()
  const [language, setLanguage] = React.useState(localStorage.getItem('language') || 'en')
  React.useEffect(() => {
    localStorage.setItem('language', language)
    i18n.changeLanguage(language)
  }, [language])

  const [showResponsiveMenu, setShowResponsiveMenu] = React.useState(false)
  return (
    <div className="pt-6 pb-4 fixed w-full h-16 bg-white" style={{ borderBottom: '4px solid #ffc800', boxShadow: '0 4px #000', zIndex: 10000 }}>
      <div className="flex flex-row justify-between mx-4 md:mx-auto max-w-6xl">
        <div className="flex flex-row items-center">
          <Link to={'/'}>
            <img alt={''} src={appLogo} className="h-5 mr-3" />
          </Link>
          <div className="hidden md:flex flex-row text-xs font-semibold border-l pl-5">
            <div className="cursor-pointer opacity-75 hover:text-primary" onClick={() => setLanguage('en')}>English</div>
            <div className="cursor-pointer opacity-75 hover:text-primary ml-4" onClick={() => setLanguage('cn')}>中文</div>
          </div>
        </div>
        <div className="hidden md:block">
          <Link className="text-black ml-5 opacity-75 hover:text-primary" to={'/'}>{t('app_header_menu_home_title')}</Link>
          <Link className="text-black ml-5 opacity-75 hover:text-primary" to={'/governance'}>{t('app_header_menu_governance_title')}</Link>
          <Link className="text-black ml-5 opacity-75 hover:text-primary" to={'/validation-node'}>{t('app_header_menu_node_title')}</Link>
          <Link className="text-black ml-5 opacity-75 hover:text-primary" to={'/milestome'}>{t('app_header_menu_milestone_title')}</Link>
          <a className="text-black ml-5 opacity-75 hover:text-primary"
             href={
               language === 'en'
                 ? 'https://drive.google.com/file/d/1RZxJamk3dK2w-4e4TI98uXe1bCLd2Vz1/view?usp=sharing'
                 : 'https://drive.google.com/file/d/1NFZiOoILO59LemFn2-_LHMD7c3nDBHla/view?usp=sharing'
             }
             target='_blank'
             rel='noopener noreferrer'
          >
            {t('app_header_menu_whitepaper_title')}
          </a>
        </div>
        <div className="block md:hidden">
          {
            showResponsiveMenu
              ? (
                <CloseOutlined onClick={(() => setShowResponsiveMenu(false))} />
              )
              : (
                <MenuOutlined onClick={() => setShowResponsiveMenu(true)} />
              )
          }
          {<MobileModal visible={showResponsiveMenu} oncancel={() => setShowResponsiveMenu(false)} />}
        </div>
      </div>
    </div>
  )
}
