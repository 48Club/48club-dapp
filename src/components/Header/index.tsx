import React from 'react'
import { Link } from 'react-router-dom'
import appLogo from '../../assets/images/icon/logo-app.svg'

export default function Header() {
  return (
    <div className="py-4 fixed w-full h-16 bg-white" style={{borderBottom: "4px solid #ffc800", boxShadow: "0 4px #000", zIndex: 999}}>
      <div className="flex flex-row justify-between mx-auto max-w-6xl">
        <div className="flex flex-row items-center">
          <Link to={'/'}>
            <img alt={''} src={appLogo} className="h-5 mr-3" />
          </Link>
          <div className="flex flex-row text-xs font-semibold border-l pl-5">
            <div className="cursor-pointer opacity-75 hover:text-primary">English</div>
            <div className="cursor-pointer opacity-75 hover:text-primary ml-4">中文</div>
          </div>
        </div>
        <div>
          <Link className="text-black ml-5 opacity-75 hover:text-primary" to={'/'}>主页</Link>
          <Link className="text-black ml-5 opacity-75 hover:text-primary" to={'/governance'}>治理</Link>
          <Link className="text-black ml-5 opacity-75 hover:text-primary" to={'/validation-node'}>节点</Link>
          <Link className="text-black ml-5 opacity-75 hover:text-primary" to={'/milestome'}>大事记</Link>
          <Link className="text-black ml-5 opacity-75 hover:text-primary" to={'/'}>白皮书</Link>
        </div>
      </div>
    </div>
  )
}
