/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="vite/client" />


declare module 'js-cookie';

declare module 'ipfs-http-client';

declare module 'state'

interface Window {
    ethereum?: {
      isMetaMask?: true
      request?: (...args: any[]) => boolean
      on?: (...args: any[]) => void
      removeListener?: (...args: any[]) => void
      autoRefreshOnNetworkChange?: boolean
    }
    web3?: {}
  }
  