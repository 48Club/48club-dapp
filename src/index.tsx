import React, { Suspense } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import ReactDOM from 'react-dom'
import { ChainId, DAppProvider } from '@usedapp/core'
import './assets/styles/antd.less'
import './assets/styles/index.css'
import App from './App'
import store from './state'
import { Config } from '@usedapp/core/src/model/config/Config'

const config: Partial<Config> = {
  readOnlyChainId: ChainId.BSCTestnet,
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
