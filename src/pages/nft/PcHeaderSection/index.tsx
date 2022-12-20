import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import React from 'react'
import { useHistory } from 'react-router'
import useNftInfo from '../../../hooks/nft/useNftInfo'

export default function PcHeaderSection() {
  let history = useHistory()
  const { totalSupply, myBalance } = useNftInfo()

  const createNFT = () => {
    let path = `/nft/create`
    history.push(path)
  }

  const { t } = useTranslation()

  return (
    <div className="mt-8 px-14 flex flex-row justify-between bg-another-white items-center min-h-[220px]">
      <div>
        <div className="text-4xl font-bold">{t('my_nft')}</div>
        <div className="my-4 text-base font-normal text-dark-gray flex flex-row">
          <div className="mr-8">{`${t('total_casting')} ${totalSupply} ${t('piece')}`}</div>
          <div>{`${t('my_casting')} ${myBalance} ${t('piece')}`}</div>
        </div>
        <div className="w-40">
          <Button className="h-12 text-sm w-full text-light-black bg-yellow rounded" onClick={createNFT}>
            {t('casting_nft')}
          </Button>
        </div>
      </div>
      <img src="/static/nft-header.png" className="w-80 mt-5" alt="" style={{ marginBottom: '-40px' }} />
    </div>
  )
}
