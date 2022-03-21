import { ChainId } from '@usedapp/core'
import { CHAIN_ID } from './env'

export const KogeAddress = {
  [ChainId.BSC]: '',
  [ChainId.BSCTestnet]: '0x2b7bfe79ec36653b84a43e86aff704b91e9f072f',
}[CHAIN_ID]

export const StakingAddress = {
  [ChainId.BSC]: '',
  [ChainId.BSCTestnet]: '0xA40219BBA6c455b41C2340123E03439f2B8cDbD7',
}[CHAIN_ID]

export const NftAddress = {
  [ChainId.BSC]: '',
  [ChainId.BSCTestnet]: '0x3e401dBE4d2c492fE997B1BfBE9D57e6d01d865c',
}[CHAIN_ID]

export const GovernanceAddress = {
  [ChainId.BSC]: '',
  [ChainId.BSCTestnet]: '0x12ea021b16F6E0Ad7Cc736D02f931C91E42D00a6',
}[CHAIN_ID]
