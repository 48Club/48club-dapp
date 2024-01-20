import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { BSC, BSCTestnet, ChainId, Config, DAppProvider, MetamaskConnector } from '@usedapp/core'
import { WalletConnectV2Connector } from '@usedapp/wallet-connect-v2-connector'
import './assets/styles/antd.less'
import './assets/styles/index.css'
import App from './App'
import store from './state'
import { CHAIN_ID, RPC_URLS } from './constants/env'
import { ConfigProvider, ThemeConfig, App as AntdApp } from 'antd'

const config: Partial<Config> = {
  networks: [CHAIN_ID === ChainId.BSC ? BSC : BSCTestnet],
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: RPC_URLS,
  connectors: {
    metamask: new MetamaskConnector(),
    walletConnectV2: new WalletConnectV2Connector({
      projectId: '96f3a7a0146532521ba4500b816d57fd',
      chains: [BSC],
      rpcMap: {
        56: 'https://bsc-dataseed.binance.org/',
      },
    }),
  },
}

// @app-theme-color: #ffc800;
// @btn-primary-color: #1e1e1e;
// @primary-color: @app-theme-color;
// @text-selection-bg: #ffc800;
// @font-size-base: 14px;
// @font-size-lg: 16px;
// @font-size-sm: 10px;
// @font-family: 'Inter', sans-serif;
// @layout-sider-background: rgba(0, 0, 0, 0.84);
// @item-active-bg: #f8f8f8;

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#ffc801',
    colorInfo: '#ffc801',
    colorSuccess: '#08c849',
    colorError: '#ef2b2b',
    colorWarning: '#e2b201',
    colorLink: '#1e1e1e',
    colorTextBase: '#1e1e1e',
    borderRadius: 4,
    wireframe: false,
  },
  components: {
    Button: {
      primaryColor: '#000',
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Suspense fallback={null}>
    <DAppProvider config={config}>
      <ReduxProvider store={store}>
        <ConfigProvider theme={theme}>
          <AntdApp>
            <App />
          </AntdApp>
        </ConfigProvider>
      </ReduxProvider>
    </DAppProvider>
  </Suspense>
)
