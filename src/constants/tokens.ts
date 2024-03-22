import { ChainId } from '@usedapp/core'
import { CHAIN_ID } from './env'


type PropsOrUndefined = {
  [key in string]: string;
} | undefined;

export const TOKENS: PropsOrUndefined = {
  [ChainId.BSC]: {
    '0xB0836DD99e3A68d70c593530548C982Ab7B95a4a': 'Pancake KOGE/bFans V2 LP',
    '0xe6DF05CE8C8301223373CF5B969AFCb1498c5528': 'KOGE',
//   '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': 'WBNB',
    '0x26De6C26DD5560C181011907d8F70C202C2a29D6': 'Pancake KOGE/BNB V2 LP',
  },
  [ChainId.BSCTestnet]: {
    '0x2B7BFE79eC36653b84A43E86AfF704B91E9f072f': 'KOGE',
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd': 'WBNB',
    '0xfcd08643A6390C465D8b12C42C0B4AFc291EAC12': 'Pancake KOGE/BNB V2 LP',
    '0x929F65bc0fC681Dcc1420D030e374bAf5D14E40E': 'Test LP',
  },
}[CHAIN_ID as number]


export const STAKING_WHITELIST: string[] | undefined = {
  [ChainId.BSC]: [
    '0xe6DF05CE8C8301223373CF5B969AFCb1498c5528',
//    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    '0x26De6C26DD5560C181011907d8F70C202C2a29D6',
  ],
  [ChainId.BSCTestnet]: [
    '0x2B7BFE79eC36653b84A43E86AfF704B91E9f072f',
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    '0xfcd08643A6390C465D8b12C42C0B4AFc291EAC12',
    '0x929F65bc0fC681Dcc1420D030e374bAf5D14E40E',
  ],
}[CHAIN_ID as number]


export default TOKENS
