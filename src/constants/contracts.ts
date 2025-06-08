import { ChainId } from '@usedapp/core'
import { CHAIN_ID } from './env'

export const START_BLOCK_NUMBER = 16397000
// export const START_BLOCK_NUMBER = 49989989


export const ZeroAddress = '0x0000000000000000000000000000000000000000'

export const KogeAddress = {
  [ChainId.BSC]: '0xe6df05ce8c8301223373cf5b969afcb1498c5528',
  [ChainId.BSCTestnet]: '0x52d7ab01f689b9cbe9eef96ae6812df3c5a41090',
}[CHAIN_ID as number]

export const StakingAddress = {
  [ChainId.BSC]: '0xa31F6B577704B4622d2ba63F6aa1b7e92fe8C8a9',
  [ChainId.BSCTestnet]: '0x242bdc5511bA662ec0CAe196d89Ed09810Aff625',
}[CHAIN_ID as number]

export const NftAddress = {
  [ChainId.BSC]: '0x57b81C140BdfD35dbfbB395360a66D54a650666D',
  [ChainId.BSCTestnet]: '0x3e401dBE4d2c492fE997B1BfBE9D57e6d01d865c',
}[CHAIN_ID as number]

export const GovernanceAddress = {
  [ChainId.BSC]: '0x71E4407ba985d6a08c637E91FC0AA3721B456F3f',
  [ChainId.BSCTestnet]: '0xc7bC41894Fb8E87f23b7eFe0ee57DFc4F66b6782',
}[CHAIN_ID as number]

export const GovernanceAddressNew = {
  [ChainId.BSC]: '0x548011bb876f5e9eee1a346ea54b9ef7a2ad53c8',
  [ChainId.BSCTestnet]: '0x74a425Cbd98608a9a0129236F74402FAd4120Dcf',
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
  [ChainId.BSC]: '0xbC4Fda8A6d6fA1Bb64510BAd3F511c1aa79B2E12',
  [ChainId.BSCTestnet]: '0x3b7cDCd358b7324Bf46168e4f41d540B720532f8',
}[CHAIN_ID as number]

export const wrappedToken = {
  /// bfans
  [ChainId.BSC]: '0x31dE513CA57256eac495a158f2Cd069B7f308564',
  [ChainId.BSCTestnet]: '0x31dE513CA57256eac495a158f2Cd069B7f308564',
}[CHAIN_ID as number]

export const wrappedAddress = {
  [ChainId.BSC]: '0x83b16A2C9Bf52Ea03036E8617c9Dd13AE975f218',
  [ChainId.BSCTestnet]: '0x83b16A2C9Bf52Ea03036E8617c9Dd13AE975f218',
}[CHAIN_ID as number]

export const stakeInscription = {
  [ChainId.BSC]: '',
  [ChainId.BSCTestnet]: '0xC29C4320c6224efA87136cd9D2885bbBa090171f',
}[CHAIN_ID as number]

export const airdropAddress = {
  [ChainId.BSC]: '0x092F23A885649936306b7702f588815445427934',
  [ChainId.BSCTestnet]: '0x0000000000000000000000000000000000000000',
}[CHAIN_ID as number]
