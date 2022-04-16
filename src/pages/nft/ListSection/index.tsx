import React, { useState } from 'react'
import { Skeleton, Switch } from 'antd'
import { useHistory } from 'react-router-dom'
import edit from '../../../assets/images/icon/edit.svg'
import useNftInfo, { INFTInfo } from '../../../hooks/nft/useNftInfo'
import { useEthers } from '@usedapp/core'
import { shorten } from '@funcblock/dapp-sdk'
import { useTranslation } from 'react-i18next'

export default function ListSection() {
  const { myNFTs, NFTs } = useNftInfo()
  const history = useHistory()

  const editNft = ({ id }: INFTInfo) => {
    const path = `/nft/create?edit=true&id=${id.toString()}`
    history.push(path)
  }
  const { t } = useTranslation()
  const [related, setRelated] = useState(false)

  return (
    <div className="pb-20">
      <div className="mt-10 shrink-0 w-20 flex flex-col md:w-24" style={{ flexShrink: 0 }}>
          <span className="text-sm leading-5 mb-2 text-light-black">
            {t('filter_related')}
          </span>
        <Switch
          checked={related}
          className="filter-switch w-full h-12"
          onChange={setRelated}
        />
      </div>
      <div className="mt-0 md:mt-16 flex flex-col md:flex-row md:flex-wrap w-full">
        {(related ? myNFTs : NFTs).map((i) => (
          <NftItem nft={i} key={i.id} onEdit={editNft} />
        ))}
      </div>
    </div>
  )
}

function NftItem({ nft, onEdit }: {
  nft: INFTInfo;
  onEdit: (nft: INFTInfo) => void;
}) {
  const { t } = useTranslation()
  const { account } = useEthers()

  return (
    <div className="w-full md:w-1/4 px-3 flex flex-col text-xs mb-10">
      <div className="h-full relative shadow p-4 pb-8">
        {!nft.image ? (
          <>
            <Skeleton.Image className="w-full" />
            <Skeleton active paragraph={{ rows: 1 }} />
          </>
        ) : (
          <>
            <div className="overflow-hidden">
              <img
                src={nft.image}
                alt=""
                className="h-20 w-full object-contain transform hover:scale-105 transition duration-240"
              />
            </div>
            {
              account === nft.owner && (
                <img
                  className="absolute block top-7 right-7 w-8 h-8 cursor-pointer"
                  src={edit}
                  alt=""
                  onClick={() => onEdit(nft)}
                />
              )
            }
            <div className="mt-4 text-light-black text-base">{nft.name}</div>
            <div className="mt-2 text-gray text-xs">{nft.description}&nbsp;</div>
            <div className="mt-2 text-gray text-xs">{t('Owner')}: {shorten(nft.owner)}</div>
          </>
        )}
      </div>
    </div>
  )
}
