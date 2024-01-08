/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="vite/client" />

declare module 'js-cookie'

declare module 'ipfs-http-client'

declare module 'state'

declare module 'uuid'

declare module 'react-copy-to-clipboard'

interface Window {
  ethereum?: {
    isMetaMask?: true
    networkVersion?: any
    request?: (...args: any[]) => boolean
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
    autoRefreshOnNetworkChange?: boolean
  }
  web3?: {}
}
