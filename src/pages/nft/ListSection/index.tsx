import React, { useState, useCallback } from 'react'
import { Skeleton, Switch, Modal, Input, Button } from 'antd'
import { useHistory } from 'react-router-dom'
import edit from '../../../assets/images/icon/edit.svg'
import useNftInfo, { INFTInfo } from '../../../hooks/nft/useNftInfo'
import { useEthers } from '@usedapp/core'
import { shorten } from '@funcblock/dapp-sdk'
import { useTranslation } from 'react-i18next'
import { SendOutlined } from '@ant-design/icons'
import useNft from '../../../hooks/nft/useNft'

export default function ListSection() {
  const { myNFTs, NFTs } = useNftInfo()
  const { transferLoading, onTransfer } = useNft()
  const history = useHistory()

  const editNft = ({ id }: INFTInfo) => {
    const path = `/nft/create?edit=true&id=${id.toString()}`
    history.push(path)
  }
  const { t } = useTranslation()
  const [related, setRelated] = useState(false)
  const [show, setShow] = useState(false)
  const [currentNft, setCurrentNft] = useState<INFTInfo>()
  const [receiver, setReceiver] = useState('')

  const transferHandler = useCallback(async () => {
    if (!receiver || !currentNft?.id) return
    await onTransfer(receiver, String(currentNft?.id))
    window.setTimeout(() => {
      setShow(false)
    }, 240)
  }, [currentNft, onTransfer, receiver])

  return (
    <div className="pb-20">
      <div className="mt-10 shrink-0 w-20 flex flex-col md:w-24" style={{ flexShrink: 0 }}>
        <span className="text-sm leading-5 mb-2 text-light-black">{t('filter_related')}</span>
        <Switch checked={related} className="filter-switch w-full h-12" onChange={setRelated} />
      </div>
      <div className="mt-0 md:mt-16 flex flex-col md:flex-row md:flex-wrap w-full">
        {(related ? myNFTs : NFTs).map((i) => (
          <NftItem
            nft={i}
            key={i.id}
            onEdit={editNft}
            onSend={(nft) => {
              setCurrentNft(nft)
              setShow(true)
            }}
          />
        ))}
      </div>
      <Modal visible={show} footer={false} destroyOnClose>
        <div className="p-6 rounded-xl">
          <div className="relative pt-4 text-center text-[#1E1E1E] text-xl font-bold">
            Send NFT
            <img
              src="/static/close.svg"
              className="absolute top-0 right-0 transform -translate-y-1/2 cursor-pointer"
              alt=""
              onClick={() => {
                setShow(false)
              }}
            />
          </div>
          <div className="">
            <label className="block h-10 mb-2 flex items-center text-sm">Address</label>
            <Input size="large" className="h-12 rounded" onChange={(e) => setReceiver(e.target.value)} />
          </div>
          <div className="w-full mt-6 flex justify-center gap-6 flex-wrap">
            <Button
              size="large"
              className="w-50 h-12 bg-gray rounded"
              onClick={() => {
                setShow(false)
              }}
            >
              {t('pool_cancel')}
            </Button>
            <Button
              type="primary"
              size="large"
              className="w-50 h-12 rounded"
              loading={transferLoading}
              onClick={transferHandler}
            >
              {t('pool_confirm')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function NftItem({
  nft,
  onEdit,
  onSend,
}: {
  nft: INFTInfo
  onEdit: (nft: INFTInfo) => void
  onSend?: (nft: INFTInfo) => void
}) {
  const { t } = useTranslation()
  const { account } = useEthers()

  return (
    <div className="w-full md:w-1/4 px-3 flex flex-col text-xs mb-10">
      <div className="h-full relative shadow p-4 pb-8">
        {!nft.image ? (
          <>
            <Skeleton.Image className="w-full" />
            <Skeleton active paragraph={{ rows: 1 }} className="mt-4" />
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
            {account === nft.owner && (
              <div className="absolute block top-7 right-7 flex flex-col gap-2">
                <img className="w-8 h-8 cursor-pointer" src={edit} alt="" onClick={() => onEdit(nft)} />
                <SendOutlined
                  className="w-8 h-8 flex items-center justify-center cursor-pointer text-white bg-white bg-opacity-20 rounded"
                  style={{ fontSize: '16px' }}
                  onClick={() => onSend?.(nft)}
                />
              </div>
            )}
            <div className="mt-4 text-light-black text-base">{nft.name}</div>
            <div className="mt-2 text-gray text-xs">{nft.description}&nbsp;</div>
            <div className="mt-2 text-gray text-xs">
              {t('Owner')}: {shorten(nft.owner)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
