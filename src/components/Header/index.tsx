import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import appLogo from '../../assets/images/icon/logo-app.svg'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import MobileModal from './MobileModal'
import { CloseOutlined, MenuOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import { useEthers, useTransactions } from '@usedapp/core'
import { shorten } from '@funcblock/dapp-sdk'
import Loader from '../Loader'
import { CHAIN_ID_HEX } from '../../constants/env'
import Cookies from 'js-cookie'

export default function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en')

  useEffect(() => {
    localStorage.setItem('language', language)
    i18n.changeLanguage(language).catch(console.error)
  }, [language])

  const menu = (
    <Menu className="bg-white">
      <Menu.Item>
        <Link className="text-black opacity-75 hover:text-primary" to={'/'}>{t('app_header_menu_home_title')}</Link>
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
          href="https://docs.48.club"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('app_header_menu_docs_title')}
        </a>
      </Menu.Item>
    </Menu>
  )

  const [showResponsiveMenu, setShowResponsiveMenu] = useState(false)
  return (
    <div className="py-4 fixed w-full bg-white items-center" style={{ borderBottom: '4px solid #ffc800', zIndex: 20 }}>
      <div className="flex flex-row justify-between mx-4 md:mx-auto max-w-6xl <xl:px-4">
        <div className="flex flex-row items-center">
          <Link to={'/'}>
            <img alt={''} src={appLogo} className="h-3 md:h-5 mr-3" />
          </Link>
          <div className="hidden md:flex flex-row items-center">
            <Link className={`ml-5 font-medium hover:text-primary ${location.pathname.startsWith('/staking') ? 'text-primary' : 'text-black'}`}
              to={'/staking'}>
              {t('nav-staking')}
            </Link>
            <Link className={`ml-5 font-medium hover:text-primary ${location.pathname.startsWith('/nft') ? 'text-primary' : 'text-black'}`}
              to={'/nft'}>
              {t('nav-nft')}
            </Link>
            <Link className={`ml-5 font-medium hover:text-primary ${location.pathname.startsWith('/voting') ? 'text-primary' : 'text-black'}`}
              to={'/voting'}>
              {t('nav-voting')}
            </Link>
            <Link className={`ml-5 font-medium hover:text-primary ${location.pathname.startsWith('/pool') ? 'text-primary' : 'text-black'}`}
              to={'/pool'}>
              {t('nav-farm')}
            </Link>
            <Dropdown overlay={menu} placement="bottomLeft" overlayStyle={{ zIndex: 10000 }}>
              <div className="text-black ml-5 font-medium hover:text-primary cursor-pointer">{t('nav-more')}</div>
            </Dropdown>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="bg-secondary flex flex-row items-center cursor-pointer">
            <div className="text-primary px-3">BSC</div>
            <Web3Status />
          </div>
          <div className="ml-4 hidden md:flex flex-row text-xs font-semibold">
            <div className="cursor-pointer opacity-75 hover:text-primary" onClick={() => setLanguage('cn')} style={{ color: language === 'cn' ? '#FFC801' : 'black' }}>中文</div>
            <div className="cursor-pointer opacity-75 hover:text-primary ml-2 pl-2 border-l" onClick={() => setLanguage('en')} style={{ color: language === 'en' ? '#FFC801' : 'black' }}>EN</div>
          </div>
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
let once = false
function Web3Status() {
  const { t } = useTranslation()
  const { transactions } = useTransactions()
  const { library, chainId, activateBrowserWallet, error, account } = useEthers()

  if (!once) {
    once = true;
    (async () => {
      // add cookie (rejected)
      if (Cookies.get('rejected-change-rpc') !== 'true') {
        await library?.provider.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: CHAIN_ID_HEX,
            rpcUrls: ["https://1gwei.48.club"],
            chainName: "48Club 1Gwei Privacy",
            nativeCurrency: { name: "BNB", decimals: 18, symbol: "BNB" },
            blockExplorerUrls: ["https://bscscan.com"],
            iconUrls: ["https://raw.githubusercontent.com/48Club/48club-dapp/master/public/static/favicon/favicon-32x32.png"]
          }]
        }).catch((error) => {
          if (error.code === 4001) {
            Cookies.set('rejected-change-rpc', 'true', { path: '' })
          }
        });
      }
    })();
  }
  const pendingCount = transactions.filter(i => !i.receipt).length
  const activate = useCallback(async () => {
    try {
      if (window.ethereum && window.ethereum.request) {
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CHAIN_ID_HEX }],
        })
      }
    } catch (e) {
      console.error(e)
    }
    setTimeout(activateBrowserWallet, 1000)
  }, [activateBrowserWallet])

  if (account) {
    return (
      <div className="px-4 bg-primary rounded py-2" onClick={activate}>
        {pendingCount > 0 ? (
          <div className="flex flex-row justify-center items-center">
            <div className="pr-2">{pendingCount} Pending</div>
            <Loader stroke="black" />
          </div>
        ) : shorten(account)}
      </div>
    )
  }

  return (
    <div className="px-4 bg-primary rounded py-2" onClick={activate}>
      {t('connect_wallet')}
    </div>
  )
}
