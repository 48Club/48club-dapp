import { BSC, BSCTestnet, ChainId } from '@usedapp/core'

export const CHAIN_ID = (parseInt(process.env.REACT_APP_CHAIN_ID ?? ChainId.BSC.toString())) as ChainId
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const RPC_URLS = {
  [BSCTestnet.chainId]: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  [BSC.chainId]: 'https://bsc-dataseed.binance.org/',
}

export const READONLY_RPC_URL = {
  ...RPC_URLS,
  [BSC.chainId]: 'https://erigon-bsc.bnb48.club/',
}[CHAIN_ID]

console.log('IS_PRODUCTION', IS_PRODUCTION)
console.log('CHAIN_ID', CHAIN_ID)
