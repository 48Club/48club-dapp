import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-xhr-backend'
import translationEN from './locales/en/translation.json'
import stakingEN from './locales/en/staking.json'
import translationCN from './locales/cn/translation.json'
import stakingCN from './locales/cn/staking.json'
import nftEN from './locales/en/nft.json'
import nftCN from './locales/cn/nft.json'
import votingEN from './locales/en/voting.json'
import votingCN from './locales/cn/voting.json'
import modalEN from './locales/en/modal.json'
import modalCN from './locales/cn/modal.json'
import poolEN from './locales/en/pool.json'
import poolCN from './locales/cn/pool.json'

i18n
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // connect with React
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: {
        translation: {
          ...translationEN,
          ...stakingEN,
          ...stakingEN,
          ...nftEN,
          ...modalEN,
          ...votingEN,
          ...poolEN,
        },
      },
      cn: {
        translation: {
          ...translationCN,
          ...stakingCN,
          ...stakingCN,
          ...nftCN,
          ...modalCN,
          ...votingCN,
          ...poolCN,
        },
      },
    },
    debug: false,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      caches: ['localStorage', 'sessionStorage', 'cookie'],
    },
  })

export default i18n
