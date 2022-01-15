import React, { Suspense } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import ReactDOM from 'react-dom'
import { BSCTestnet, Config, DAppProvider } from '@usedapp/core'
import './assets/styles/antd.less'
import './assets/styles/index.css'
import App from './App'
import store from './state'

const config: Partial<Config> = {
  networks: [BSCTestnet],
  readOnlyChainId: BSCTestnet.chainId,
  readOnlyUrls: {
    [BSCTestnet.chainId]: 'https://data-seed-prebsc-2-s2.binance.org:8545/',
  },
}

ReactDOM.render(
  <Suspense fallback={null}>
    <DAppProvider config={config}>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </DAppProvider>
  </Suspense>
  , document.getElementById('root'),
)
