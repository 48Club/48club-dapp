import React from 'react'
import { Skeleton } from 'antd'
import edit from '../../../assets/images/icon/edit.svg'
import useNftInfo, { INFTInfo } from '../../../hooks/nft/useNftInfo'

export default function ListSection() {
  const { myNFTs } = useNftInfo()

  return (
    <div className="flex flex-col items-center pb-20">
      <div className="mt-0 md:mt-16 flex flex-col md:flex-row md:flex-wrap w-full">
        {myNFTs.reverse().map(i => <NftItem nft={i} key={i.id} />)}
      </div>
    </div>
  )
}

function NftItem({ nft }: { nft: INFTInfo }) {
  return (
    <div className="w-full md:w-1/4 px-3 flex flex-col text-xs mb-10">
      <div className="h-full relative shadow p-4 pb-8">
        {
          !nft.image
          ? <>
              <Skeleton.Image className="w-full" />
              <Skeleton active paragraph={{rows: 1}} />
            </>
          :
            <>
              <img src={nft.image}
                alt=""
                className="h-20 w-full object-cover transform hover:scale-105 transition duration-240"
              />
              <img className="absolute top-7 right-7 w-8 h-8 cursor-pointer" src={edit} alt="" />
              <div className="mt-4 text-light-black text-base">{nft.name}</div>
              <div className="mt-2 text-gray text-xs">
                {nft.description}
              </div>
            </>
        }
      </div>
    </div>
  )
}
