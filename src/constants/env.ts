import { BSC, BSCTestnet, ChainId } from '@usedapp/core'

export let CHAIN_ID = ChainId.BSC
// export let CHAIN_ID = ChainId.BSCTestnet

export const CHAIN_ID_HEX = '0x' + CHAIN_ID.toString(16)
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const RPC_URLS = {
  [BSCTestnet.chainId]: 'https://chapel.rpc.48.club',
  [BSC.chainId]: 'https://bsc-dataseed.binance.org/',
}

export const READONLY_RPC_URL = {
  ...RPC_URLS,
  [BSC.chainId]: 'https://fake-rpc.48.club/',
}[CHAIN_ID]

console.log('IS_PRODUCTION', IS_PRODUCTION)
console.log('CHAIN_ID', CHAIN_ID)
