import { ZeroAddress } from '@/constants/chain'
import { getAddress } from '@ethersproject/address'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    // Alphabetical letters must be made lowercase for getAddress to work.
    // See documentation here: https://docs.ethers.io/v5/api/utils/address/
    return getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

// Shortens an Ethereum address
export function shortenAddress(address = '', charsStart = 4, charsEnd = 4): string {
  const parsed = isAddress(address)
  if (!parsed) return ''
  return ellipseAddressAdd0x(parsed, charsStart, charsEnd)
}

/**
 * Shorten an address and add 0x to the start if missing
 * @param targetAddress
 * @param charsStart amount of character to shorten (from both ends / in the beginning)
 * @param charsEnd amount of characters to shorten in the end
 * @returns formatted string
 */
function ellipseAddressAdd0x(targetAddress: string, charsStart = 4, charsEnd = 4): string {
  const hasPrefix = targetAddress.startsWith('0x')
  const prefix = hasPrefix ? '' : '0x'
  return ellipseMiddle(prefix + targetAddress, charsStart + 2, charsEnd)
}

/**
 * Shorten a string with "..." in the middle
 * @param target
 * @param charsStart amount of character to shorten (from both ends / in the beginning)
 * @param charsEnd amount of characters to shorten in the end
 * @returns formatted string
 */
function ellipseMiddle(target: string, charsStart = 4, charsEnd = 4): string {
  return `${target.slice(0, charsStart)}...${target.slice(target.length - charsEnd)}`
}

/**
 * compare two address
 * @param a
 * @param b
 * @returns
 */
export function compareAddress(a: string | undefined, b: string | undefined) {
  if (!a || !b) return false

  //validate
  if (!isAddress(a) || !isAddress(b)) return false

  return a.toLowerCase() === b.toLowerCase()
}

export function compareAddresses(a: string[] | undefined, b: string[] | undefined) {
  if (!a || !b) return false

  const validA = a.filter((x) => !compareAddress(ZeroAddress, x))
  const validB = b.filter((x) => !compareAddress(ZeroAddress, x))

  const len1 = validA.length
  const len2 = validB.length

  if (len1 != len2) return false

  const result = true

  for (let i = 0; i < len1; ++i) {
    if (!compareAddress(validA[i], validB[i])) return false
  }

  return result
}
