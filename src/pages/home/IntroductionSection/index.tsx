import React from 'react'
import './index.less'
import { useTranslation } from 'react-i18next'

export default function CustomerSection() {
  const { t } = useTranslation()

  return (
    <div className="introduction-section">
      <div className="container">
        <div className="section-header">
          <div className="section-logo">
            <img src="/static/logo-koge-01.png" alt="Koge" />
          </div>
          <div className="section-title">
            {t('home_page_introduction_section_title')}
          </div>
          <div className="section-subtitle">
            {t('home_page_introduction_section_subtitle')}
          </div>
        </div>
      </div>
    </div>
  )
}
