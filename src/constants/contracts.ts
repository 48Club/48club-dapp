import { ChainId } from '@usedapp/core'
import { CHAIN_ID } from './env'

export const KogeAddress = {
  [ChainId.BSC]: '',
  [ChainId.BSCTestnet]: '0x2b7bfe79ec36653b84a43e86aff704b91e9f072f',
}[CHAIN_ID]

export const StakingAddress = {
  [ChainId.BSC]: '',
  [ChainId.BSCTestnet]: '0x4D481fB79a22759c0Dbc0deB8d8DcA8C2F7B45EA',
}[CHAIN_ID]

export const NftAddress = {
  [ChainId.BSC]: '',
  [ChainId.BSCTestnet]: '0x3e401dBE4d2c492fE997B1BfBE9D57e6d01d865c',
}[CHAIN_ID]

export const GovernanceAddress = {
  [ChainId.BSC]: '',
  [ChainId.BSCTestnet]: '0x8E0180877F236C039459a9Cfd302a8F84F786709',
}[CHAIN_ID]
