import React, { Suspense } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import ReactDOM from 'react-dom'
import { BSC, BSCTestnet, ChainId, Config, DAppProvider } from '@usedapp/core'
import './assets/styles/antd.less'
import './assets/styles/index.css'
import App from './App'
import store from './state'
import { CHAIN_ID, RPC_URLS } from './constants/env'

const config: Partial<Config> = {
  networks: [CHAIN_ID === ChainId.BSC ? BSC : BSCTestnet],
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: RPC_URLS,
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
