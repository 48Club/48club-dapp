import { PictureOutlined } from '@ant-design/icons'
import { Button, Input, Upload } from 'antd'
import Back from 'components/Back'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useNft from '../../hooks/nft/useNft'
import useNftInfo from '../../hooks/nft/useNftInfo'
import { formatAmount } from '@funcblock/dapp-sdk'
import ipfs from '../../utils/ipfs'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const { TextArea } = Input
export default function NFTCreate() {
  const { t } = useTranslation()
  const [activeItemOfCount, setActiveItemOfCount] = useState(0)
  const [activeItemOfCustomize, setActiveItemOfCustomize] = useState(0)
  const [previewVisible, setPrebiewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<any[]>([])
  const [uploadLoading, setUploadLoading] = useState(false)
  const { onMint, mintLoading, onApprove, approveLoading, isAllowed } = useNft()
  const { nextMintCost, totalSupply } = useNftInfo()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file)
    }

    setPrebiewVisible(true)
    setPreviewImage(file.url || file.preview)
  }
  const exitPreview = () => {
    setPrebiewVisible(false)
  }

  const beforeUpload = (file) => {
    setFileList([...fileList, file])
    handlePreview(file)
    return false
  }

  const onRemove = (file) => {
    const index = fileList.indexOf(file)
    const newList = fileList.slice()
    newList.splice(index, 1)
    setFileList(newList)
  }

  const handleUpload = async () => {
    setUploadLoading(true)
    try {
      const imgRes = await ipfs.add(fileList[0])
      if (!imgRes) {
        return
      }
      const imgCid = imgRes.cid.toV1().toString()
      const ipfsRes = await ipfs.add({
        content: JSON.stringify({
          name: name,
          description: desc,
          image: 'ipfs://' + imgCid,
        }),
      })
      await onMint(ipfsRes.cid.toV1().toString())
      setUploadLoading(false)
      setFileList([])
    } catch (error) {
      setUploadLoading(false)
      setFileList([])
    }
  }

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <div className="mt-8 flex flex-row justify-between">
        <Back />
        <div
          className="ml-4 flex-1 rounded-2xl flex flex-col items-center"
          style={{ backgroundColor: '#FFFBEC' }}
        >
        <span className="mt-8 font-bold text-2xl mb-4 text-light-black">
          {t('create_koge_nft')}
        </span>
          <span className="text-base mb-10 text-dark-gray">
            {t('nft_description')}
        </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/*<div className="flex flex-col mt-10">*/}
        {/*  <span className="text-sm font-medium mb-2 text-light-black">*/}
        {/*    {t('select_create_count')}*/}
        {/*  </span>*/}
        {/*  <div className="flex flex-row">*/}
        {/*    <div*/}
        {/*      className={`cursor-pointer h-10 text-sm text-center w-full mr-4 border leading-10 rounded  ${activeItemOfCount === 0 ? 'border-yellow' : 'border-gray'}`}*/}
        {/*      onClick={() => setActiveItemOfCount(0)}*/}
        {/*    >*/}
        {/*      {t('create_single_nft')}*/}
        {/*    </div>*/}
        {/*    <div*/}
        {/*      className={`cursor-pointer h-10 text-sm text-center w-full border leading-10 rounded ${activeItemOfCount === 1 ? 'border-yellow' : 'border-gray'}`}*/}
        {/*      onClick={() => setActiveItemOfCount(1)}*/}
        {/*    >*/}
        {/*      {t('create_multiple_nfts')}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div className="flex flex-col mt-10">*/}
        {/*  <span className="text-sm font-medium mb-2 text-light-black">*/}
        {/*    {t('create_nft_type')}*/}
        {/*  </span>*/}
        {/*  <div className="flex flex-row">*/}
        {/*    <div*/}
        {/*      className={`cursor-pointer h-10 text-sm text-center w-full mr-4 border leading-10 rounded ${activeItemOfCustomize === 0 ? 'border-yellow' : 'border-gray'}`}*/}
        {/*      onClick={() => setActiveItemOfCustomize(0)}*/}
        {/*    >*/}
        {/*      {t('customize')}*/}
        {/*    </div>*/}
        {/*    <div*/}
        {/*      className={`cursor-pointer h-10 text-sm text-center w-full border text-yellow leading-10 rounded ${activeItemOfCustomize === 1 ? 'border-yellow' : 'border-gray'}`}*/}
        {/*      onClick={() => setActiveItemOfCustomize(1)}*/}
        {/*    >*/}
        {/*      {t('system_customize')}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">
          {t('upload_nft_file')}
        </span>
          <div className="flex flex-col bg-light-white w-full items-center px-12 justify-center py-24">
            {
              previewVisible
                ? <img onClick={exitPreview} alt="example" style={{ width: '100%' }} src={previewImage} />
                : <>
                  <PictureOutlined className="text-3xl" />
                  <div className="max-w-xs text-light-black text-xs font-medium mt-3 text-center">
                    {t('upload_nft_file_requirement')}
                  </div>
                  <Upload
                    action=""
                    accept="image/*"
                    onPreview={handlePreview}
                    onRemove={onRemove}
                    beforeUpload={beforeUpload}
                    fileList={fileList}
                    maxCount={1}
                  >
                    <Button className="h-10 mt-4 w-38 text-sm text-light-black bg-yellow">
                      {t('upload_image')}
                    </Button>
                  </Upload>
                </>
            }
          </div>
        </div>
        <div className="flex flex-col mt-12">
          <span className="text-sm font-medium mb-2 text-light-black">
            {t('nft_name')}
          </span>
          <Input
            placeholder={t('please_input')}
            className="h-12 rounded font-medium text-sm text-light-black"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col mt-12">
          <span className="text-sm font-medium mb-2 text-light-black">
            {t('nft_brief_description')}
          </span>
          <TextArea
            rows={4}
            placeholder={t('please_input')}
            className="rounded font-medium text-sm text-light-black"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </div>
        {activeItemOfCount === 1 && <div className="flex flex-col mt-12">
          <span className="text-sm font-medium mb-2 text-light-black">
            {t('amount')}
          </span>
          <Input type={'number'} />
        </div>}
        <div className="flex flex-row justify-between text-sm mt-12">
          <span className="text-dark-gray ">{t('payment_hint')}</span>
          <span className="text-light-black font-medium">
            {t('payment_value', { val: formatAmount(nextMintCost, 18) })}
        </span>
        </div>
        <div className="flex flex-row justify-between text-sm mt-4">
          <span className="text-dark-gray ">{t('nft_id_hint')}</span>
          <span className="text-light-black font-medium">{t('nft_id_value', { val: totalSupply })}</span>
        </div>
        {
          isAllowed ? (
            <Button
              className="flex items-center justify-center h-12 text-sm text-light-black bg-yellow rounded font-medium mt-6 mb-20 w-full"
              onClick={handleUpload}
              loading={uploadLoading}
              disabled={fileList.length < 1}
            >
              {t('submit_nft')}
            </Button>
          ) : (
            <Button
              className="flex items-center justify-center h-12 text-sm text-light-black bg-yellow rounded font-medium mt-6 mb-20 w-full"
              onClick={onApprove}
              loading={approveLoading}
            >
              Approve
            </Button>
          )
        }
      </div>
    </div>
  )
}
