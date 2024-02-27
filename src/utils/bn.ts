import BigNumber from 'bignumber.js'
import { ethers } from 'ethers/lib'

export const BN = (val: number | string): BigNumber => new BigNumber(val)
/**
 *
 * @param n  ethers.BigNumber
 * @param decimals   The default decimals bit to be converted is 18
 * @default decimals 18
 * @returns
 */
export const toFromBN = (n?: ethers.BigNumber, decimals = 18): BigNumber => {
  return BN(ethers.utils.formatUnits(n || 0, decimals))
}

export const fromWei = (n: string | number, decimals = 18): BigNumber => {
  return BN(n).div(BN(10).pow(decimals))
}

export const toWei = (n: string | number, decimals = 18): BigNumber => {
  return BN(n).times(BN(10).pow(decimals))
}

const toStringFromBN = function (bn: number | string, decimals = 18): string {
  const res = BN(bn).toFixed(decimals)

  return res === 'NaN' ? '0' : res
}

// eslint-disable-next-line import/no-unused-modules
export const fromBN = (bn: number | string, decimals = 18): ethers.BigNumber => {
  return ethers.utils.parseUnits(toStringFromBN(bn, decimals), decimals)
}
