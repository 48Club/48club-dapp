import React, { Suspense } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import ReactDOM from 'react-dom'
import { ChainId, DAppProvider } from '@usedapp/core'
import './assets/styles/antd.less'
import './assets/styles/index.css'
import App from './App'
import store from './state'
import BigNumber from 'bignumber.js'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
  ROUNDING_MODE: BigNumber.ROUND_FLOOR,
})

const config = {
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
