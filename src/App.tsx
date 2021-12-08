import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import MySider from './components/MySider'
import MyHeader from './components/MyHeader'
import WalletModal from './components/Modal/WalletModal'
import { NotificationsList } from './components/Notifications'
import Home from './pages/home'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <MySider />
        <Layout>
          <MyHeader />
          <div className="px-2">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route>
                <Redirect to="/" />
              </Route>
            </Switch>

            <NotificationsList />
            <WalletModal />
          </div>
        </Layout>
      </Layout>
    </BrowserRouter>
  )
}
