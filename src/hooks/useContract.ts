import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { ERC20Interface } from '@usedapp/core'

export default function useERC20Contract(address?: string) {
  return useMemo(() => address ? new Contract(address, ERC20Interface) : undefined, [address])
}
