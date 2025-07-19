import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { ERC20Interface } from '@usedapp/core'
import Governance_ABI from './abi/Governance.json'
import Governance_new_ABI from './abi/GovernanceNew.json'
import Nft_ABI from './abi/Nft.json'
import Staking_ABI from './abi/Staking.json'
import Farming_ABI from './abi/FarmingPool.json'
import FarmingFactory_ABI from './abi/FarmingPoolFactory.json'
import Oracle_ABI from './abi/Oracle.json'

import stakeinscription from './abi/stakeinscription.json'
import WrappedABI from './abi/WrappedInscription.json'
import airdropABI from './abi/airdrop.json'
import airdropStatusABI from './abi/airdropStatus.json'
import gasInfoABI from './abi/gasInfo.json'
import {
  GovernanceAddress,
  GovernanceAddressNew,
  NftAddress,
  StakingAddress,
  FarmingFactoryAddress,
  OracleAddress,
  wrappedAddress,
  stakeInscription,
  airdropAddress,
  airdropStatusAddress,
  gasInfoAddress,
} from '../constants/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { READONLY_RPC_URL, READONLY_RPC_URL_NEW } from '../constants/env'

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
export function useGovernanceContractNewReadonly() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL), [])
  return useMemo(() => new Contract(GovernanceAddressNew as string, Governance_new_ABI, provider), [provider])
}
export function useNftContract() {
  return useMemo(() => new Contract(NftAddress as string, Nft_ABI), [])
}

export function useGovernanceContract() {
  return useMemo(() => new Contract(GovernanceAddress as string, Governance_ABI), [])
}
export function useGovernanceNewContract() {
  return useMemo(() => new Contract(GovernanceAddressNew as string, Governance_new_ABI), [])
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

export function useAirDropContract() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL), [])
  return useMemo(() => new Contract(airdropAddress as string, airdropABI, provider), [provider])
}

export function useAirDropStatusContractReadonly() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL_NEW), [])
  return useMemo(() => new Contract(airdropStatusAddress as string, airdropStatusABI, provider), [provider])
}

export function useAirDropStatusContract() {
  return useMemo(() => new Contract(airdropStatusAddress as string, airdropStatusABI), [])
}

export function useGasInfoContractReadonly() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL), [])
  return useMemo(() => new Contract(gasInfoAddress as string, gasInfoABI, provider), [provider])
}

export function useGasInfoContractReadonlyNew() {
  const provider = useMemo(() => new JsonRpcProvider(READONLY_RPC_URL_NEW), [])
  return useMemo(() => new Contract(gasInfoAddress as string, gasInfoABI, provider), [provider])
}

export function useGasInfoContract() {
  return useMemo(() => new Contract(gasInfoAddress as string, gasInfoABI), [])
}
