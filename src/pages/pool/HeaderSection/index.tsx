import { NavLink } from 'react-router-dom'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { useCreatePoolShow } from '../../../store'

export default function HeaderSection() {
  const { t } = useTranslation()
  const { showCreate } = useCreatePoolShow()

  return (
    <div className="pt-4 w-auto mb-10">
      <div
        className="flex flex-col rounded-2xl items-center px-6 bg-another-white
          pt-4 pb-10
          md:flex-row md:justify-between md:h-56 md:relative md:px-14
        "
      >
        <img
          src="/static/pool_banner.png"
          className="block w-48 mb-10 md:absolute md:right-16 md:top-4 md:w-72"
          alt=""
        />
        <div className="flex flex-col">
          <span className="font-bold text-2xl leading-7 mb-4 text-light-black">{t('pool_banner')}</span>
          <span className="text-base leading-6 mb-5 text-dark-gray">{t('pool_banner_desc')}</span>

          <Button
            type="primary"
            className="min-w-30 md:w-30 h-10 text-sm font-medium rounded text-light-black"
            onClick={() => showCreate(1)}
          >
            {t('pool_btn_text')}
          </Button>
        </div>
      </div>
    </div>
  )
}
