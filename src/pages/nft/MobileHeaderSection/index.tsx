import { Button } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import useNftInfo from '../../../hooks/nft/useNftInfo'


export default function MobileHeaderSection() {
  let history = useHistory()
  const { totalSupply, myBalance } = useNftInfo()

  const createNFT = () => {
    let path = `/nft/create`
    history.push(path)
  }

  const { t } = useTranslation()
  return (
    <div className="pt-4 w-auto mb-10">
      <div className="h-110 flex flex-col rounded-2xl items-center px-6 pb-4 bg-another-white">
        <img src="/static/nft-header.png" className="flex-1 w-48 mb-8 mt-6" alt="" />
        <span className="font-bold text-2xl leading-7 mb-4 text-light-black">
        {t('my_nft')}
        </span>
        <div className="flex flex-row justify-between text-base mb-2 w-full">
          <span className="text-dark-gray ">{t('total_casting')}</span>
          <span className="font-medium text-light-black">{`${totalSupply} ${t('piece')}`}</span>
        </div>
        <div className="flex flex-row justify-between text-base mb-5 w-full">
          <span className="text-dark-gray ">{t('my_casting')}</span>
          <span className="font-medium text-light-black">{`${myBalance} ${t('piece')}`}</span>
        </div>
        <Button className="h-12 text-sm w-full text-light-black bg-yellow rounded" onClick={createNFT}>
          {t('casting_nft')}
        </Button>
      </div>
    </div>
  )
}
