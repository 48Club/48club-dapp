import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from 'antd'
import edit from '../../../assets/images/icon/edit.svg'
import useNftInfo from '../../../hooks/nft/useNftInfo'

export default function ListSection() {
  const { t } = useTranslation()
  const { tokenURIs } = useNftInfo()

  return (
    <div className="flex flex-col items-center pb-20">
      <div className="mt-0 md:mt-16 flex flex-col md:flex-row md:flex-wrap w-full">
        {tokenURIs.map((i, index) => <NftItem tokenURI={i} key={index} />)}
      </div>
      {/*<div className="pb-28">*/}
      {/*  <Button className="h-9 text-sm font-medium rounded text-light-black bg-gray">*/}
      {/*    {t('view_more')}*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </div>
  )
}

function NftItem({ tokenURI }) {
  const [json, setJson] = useState<any>()

  useEffect(() => {
    if (!tokenURI || json) {
      return
    }
    (async () => {
      try {
        const url = tokenURI.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
        const res = await fetch(url)
        const json = await res.json()
        setJson(json)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [tokenURI, json])

  return (
    <div className="w-full md:w-1/4 px-3 flex flex-col text-xs mb-10">
      {
        !json
          ? <Skeleton active />
          : <div className="relative shadow p-4 pb-8">
              <img src={json?.image?.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')} alt="" className="h-20 w-full" />
              <img className="absolute top-7 right-7 w-8 h-8 cursor-pointer" src={edit} alt="" />
              <div className="mt-4 text-light-black text-base">{json?.description}</div>
              <div className="mt-2 text-gray text-xs">
                {json?.description}
              </div>
            </div>
      }
    </div>
  )
}
