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
  [ChainId.BSCTestnet]: '0x8Eaf33b038df435B81c40BE629D292eDaEf9f97f',
}[CHAIN_ID]

export const GovernanceAddress = {
  [ChainId.BSC]: '',
  [ChainId.BSCTestnet]: '0x0B33029e075e0BC4bF69D2227d60AF9B8E8c039e',
}[CHAIN_ID]
