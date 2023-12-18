import { ChainId } from '@usedapp/core'
import { CHAIN_ID } from './env'

export const START_BLOCK_NUMBER = 16397000


export const KogeAddress = {
  [ChainId.BSC]: '0xe6df05ce8c8301223373cf5b969afcb1498c5528',
  [ChainId.BSCTestnet]: '0x2B7BFE79eC36653b84A43E86AfF704B91E9f072f',
}[CHAIN_ID as number]

export const StakingAddress = {
  [ChainId.BSC]: '0xa31F6B577704B4622d2ba63F6aa1b7e92fe8C8a9',
  [ChainId.BSCTestnet]: '0x4D481fB79a22759c0Dbc0deB8d8DcA8C2F7B45EA',
}[CHAIN_ID as number]

export const NftAddress = {
  [ChainId.BSC]: '0x57b81C140BdfD35dbfbB395360a66D54a650666D',
  [ChainId.BSCTestnet]: '0x3e401dBE4d2c492fE997B1BfBE9D57e6d01d865c',
}[CHAIN_ID as number]

export const GovernanceAddress = {
  [ChainId.BSC]: '0x71E4407ba985d6a08c637E91FC0AA3721B456F3f',
  [ChainId.BSCTestnet]: '0xc7bC41894Fb8E87f23b7eFe0ee57DFc4F66b6782',
}[CHAIN_ID as number]

export const TStakingAddress = {
  [ChainId.BSC]: '0xa31F6B577704B4622d2ba63F6aa1b7e92fe8C8a9',
  [ChainId.BSCTestnet]: '0x929F65bc0fC681Dcc1420D030e374bAf5D14E40E',
}[CHAIN_ID as number]

// export const FarmingAddress = {
//   [ChainId.BSC]: '0xa31F6B577704B4622d2ba63F6aa1b7e92fe8C8a9',
//   [ChainId.BSCTestnet]: '0x826Ae68C2E908bB4e280f09Eb2DC41DfB1f9a484',
// }[CHAIN_ID]

export const FarmingFactoryAddress = {
  [ChainId.BSC]: '0xfd74c96e1FaaB3a2D88A7d6e468cd0B0dd79e4fc',
  [ChainId.BSCTestnet]: '0xE088b760c249cf8AcdE5395645c0ef535b0101C8',
}[CHAIN_ID as number]

export const OracleAddress = {
  [ChainId.BSC]: '0xbf60Ab5D72C6157b987C7A7D3fF98df2c3cF9277',
  [ChainId.BSCTestnet]: '0x3b7cDCd358b7324Bf46168e4f41d540B720532f8',
}[CHAIN_ID as number]
