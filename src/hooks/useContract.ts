import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { ERC20Interface } from '@usedapp/core'
import Governance_ABI from './abi/Governance.json'
import Nft_ABI from './abi/Nft.json'
import Staking_ABI from './abi/Staking.json'
import { GovernanceAddress, NftAddress, StakingAddress } from '../constants/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'

export default function useERC20Contract(address?: string) {
  return useMemo(() => address ? new Contract(address, ERC20Interface) : undefined, [address])
}

export function useStakingContract() {
  return useMemo(() => new Contract(StakingAddress, Staking_ABI), [])
}

export function useStakingContractReadonly() {
  const provider = useMemo(() => new JsonRpcProvider('https://data-seed-prebsc-2-s2.binance.org:8545/'), [])
  return useMemo(() => new Contract(StakingAddress, Staking_ABI, provider), [provider])
}

export function useGovernanceContractReadonly() {
  const provider = useMemo(() => new JsonRpcProvider('https://data-seed-prebsc-2-s2.binance.org:8545/'), [])
  return useMemo(() => new Contract(GovernanceAddress, Governance_ABI, provider), [provider])
}

export function useNftContract() {
  return useMemo(() => new Contract(NftAddress, Nft_ABI), [])
}

export function useGovernanceContract() {
  return useMemo(() => new Contract(GovernanceAddress, Governance_ABI), [])
}
