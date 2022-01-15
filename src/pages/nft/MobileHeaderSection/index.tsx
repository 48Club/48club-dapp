import { Button } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

export default function MobileHeaderSection() {
  let history = useHistory()

  const createNFT = () => {
    let path = `/nft/create`
    history.push(path)
  }

  const { t } = useTranslation()
  return (
    <div className="pt-4 w-auto mb-10">
      <div className="h-96 flex flex-col rounded-2xl items-center px-6 bg-another-white">
        <img src="/static/nft-header.png" className="w-48 mb-8 mt-6" alt="" />
        <span className="font-bold text-2xl leading-7 mb-4 text-light-black">
          我的NFT
        </span>
        <div className="flex flex-row justify-between text-base mb-2 w-full">
          <span className="text-dark-gray ">总铸造数</span>
          <span className="font-medium text-light-black">3,123件</span>
        </div>
        <div className="flex flex-row justify-between text-base mb-5 w-full">
          <span className="text-dark-gray ">我的铸造数</span>
          <span className="font-medium text-light-black">3,123件</span>
        </div>
        <Button className="h-12 text-sm w-full mb-8 text-light-black bg-yellow rounded" onClick={createNFT}>
          铸造NFT
        </Button>
      </div>
    </div>
  )
}
