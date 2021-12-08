import React from 'react'
import Logo from '../../assets/images/Logo2.svg'

export default function Footer() {
  return (
    <div className="bg-black text-white w-full py-10">
      <div className="flex flex-row flex-wrap justify-start items-start w-full max-w-6xl mx-auto px-4 md:px-0">
        <div className="font-1 w-full md:flex-1 mb-4 border-b border-gray pb-4 md:mb-0 md:border-0 md:py-0">
          <div className="font-bold  flex">
            <img width={'32px'} src={Logo} alt="logo" />
            <div className="ml-3 text-3xl">YinFinance</div>
          </div>
        </div>
        <div className="font-3 w-full md:flex-1 mb-4 border-b border-gray pb-4 md:mb-0 md:border-0 md:py-0">
          <div className="font-bold">Dapp</div>
          <div className="mt-2">Pease and love</div>
          <div className="mt-2">War</div>
        </div>
        <div className="font-3 w-full md:flex-1 mb-4 border-b border-gray pb-4 md:mb-0 md:border-0 md:py-0">
          <div className="font-bold">Documentation</div>
          <div className="mt-2">Whitepaper</div>
          <div className="mt-2">For Developers</div>
          <div className="mt-2">For Traders</div>
        </div>
        <div className="font-3 w-full md:flex-1 mb-4 border-b border-gray pb-4 md:mb-0 md:border-0 md:py-0">
          <div className="font-bold">Social</div>
          <div className="mt-2">Discord</div>
          <div className="mt-2">GitHub</div>
          <div className="mt-2">Twitter</div>
          <div className="mt-2">Medium</div>
        </div>
      </div>
      <div className="pl-4 opacity-50 font-3 md:text-center md:mt-5 md:pl-0">
        © 2021 YinFinance.
      </div>
    </div>
  )
}
