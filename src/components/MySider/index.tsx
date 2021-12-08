import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import LogoText from '../../assets/images/logo_text.svg'
import { Layout } from 'antd'
import styled from 'styled-components/macro'

const { Sider } = Layout

const MyNavLink = styled(NavLink)`
  &:hover {
    .coming {
      display: inline;
    }
  }
`

export function NavItem({ path, name }) {
  const location = useLocation()
  const isActive = location.pathname === path

  return (
    <MyNavLink to={path}
               className={
                 `block my-2 pl-8 py-3 flex flex-row border-r-2 hover:text-white
                 ${isActive ? 'border-primary text-white bg-card' : 'border-transparent text-light-grey'}
                 `}
    >
      <img src={`/sidebar/${name.toLowerCase()}.svg`} alt="" className="mr-3 h-6 w-6" />
      <div>{name}</div>
    </MyNavLink>
  )
}

export default function MySider() {
  return (
    <Sider className="text-white min-h-screen border-r hidden md:block">
      <img src={LogoText} alt="" className="px-6 pt-6 pb-12 mx-auto" />
      <NavItem path="/alpaca" name="Alpaca" />
    </Sider>
  )
}
