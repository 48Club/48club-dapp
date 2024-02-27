import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { ERC20Interface } from '@usedapp/core'
import Governance_ABI from './abi/Governance.json'
import Nft_ABI from './abi/Nft.json'
import Staking_ABI from './abi/Staking.json'
import Farming_ABI from './abi/FarmingPool.json'
import FarmingFactory_ABI from './abi/FarmingPoolFactory.json'
import Oracle_ABI from './abi/Oracle.json'

import stakeinscription from './abi/stakeinscription.json'
import WrappedABI from './abi/WrappedInscription.json'
import {
  GovernanceAddress,
  NftAddress,
  StakingAddress,
  FarmingFactoryAddress,
  OracleAddress,
  wrappedAddress,
  stakeInscription,
} from '../constants/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { READONLY_RPC_URL } from '../constants/env'

export default function useERC20Contract(address?: string) {
  return useMemo(() => (address ? new Contract(address, ERC20Interface) : undefined), [address])
}

export function useStakingContract() {
  return useMemo(() => new Contract(StakingAddress as string, Staking_ABI), [])
}

export function useStakingContractReadonly() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL), [])
  return useMemo(() => new Contract(StakingAddress as string, Staking_ABI, provider), [provider])
}

export function useGovernanceContractReadonly() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL), [])
  return useMemo(() => new Contract(GovernanceAddress as string, Governance_ABI, provider), [provider])
}

export function useNftContract() {
  return useMemo(() => new Contract(NftAddress as string, Nft_ABI), [])
}

export function useGovernanceContract() {
  return useMemo(() => new Contract(GovernanceAddress as string, Governance_ABI), [])
}

export function useFarmingContract(address: string) {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL), [])
  return useMemo(() => new Contract(address, Farming_ABI, provider), [address, provider])
}

export function useFarmingFactoryContract() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL), [])
  return useMemo(() => new Contract(FarmingFactoryAddress as string, FarmingFactory_ABI, provider), [provider])
}

export function useOracleContract() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL), [])
  return useMemo(() => new Contract(OracleAddress as string, Oracle_ABI, provider), [provider])
}

export function useWrappedContract() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL), [])
  return useMemo(() => new Contract(wrappedAddress as string, WrappedABI, provider), [provider])
}

export function useStakeInscriptionContract() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL), [])
  return useMemo(() => new Contract(stakeInscription as string, stakeinscription, provider), [provider])
}
