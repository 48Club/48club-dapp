import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { ERC20Interface } from '@usedapp/core'
import Governance_ABI from './abi/Governance.json'
import Nft_ABI from './abi/Nft.json'
import Staking_ABI from './abi/Staking.json'
import { GovernanceAddress, NftAddress, StakingAddress } from '../constants/contracts'

export default function useERC20Contract(address?: string) {
  return useMemo(() => address ? new Contract(address, ERC20Interface) : undefined, [address])
}

export function useStakingContract() {
  return useMemo(() => new Contract(StakingAddress, Staking_ABI), [])
}

export function useNftContract() {
  return useMemo(() => new Contract(NftAddress, Nft_ABI), [])
}

export function useGovernanceContract() {
  return useMemo(() => new Contract(GovernanceAddress, Governance_ABI), [])
}
