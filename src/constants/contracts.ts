import { ChainId } from '@usedapp/core'
import { CHAIN_ID } from './env'

export const KogeAddress = {
  [ChainId.BSC]: '0xe6df05ce8c8301223373cf5b969afcb1498c5528',
  [ChainId.BSCTestnet]: '0x2b7bfe79ec36653b84a43e86aff704b91e9f072f',
}[CHAIN_ID]

export const StakingAddress = {
  [ChainId.BSC]: '0xa31F6B577704B4622d2ba63F6aa1b7e92fe8C8a9',
  [ChainId.BSCTestnet]: '0x4D481fB79a22759c0Dbc0deB8d8DcA8C2F7B45EA',
}[CHAIN_ID]

export const NftAddress = {
  [ChainId.BSC]: '0x57b81C140BdfD35dbfbB395360a66D54a650666D',
  [ChainId.BSCTestnet]: '0x3e401dBE4d2c492fE997B1BfBE9D57e6d01d865c',
}[CHAIN_ID]

export const GovernanceAddress = {
  [ChainId.BSC]: '0x71E4407ba985d6a08c637E91FC0AA3721B456F3f',
  [ChainId.BSCTestnet]: '0xc7bC41894Fb8E87f23b7eFe0ee57DFc4F66b6782',
}[CHAIN_ID]
