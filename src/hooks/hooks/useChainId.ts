import { switchChain } from '@/constants/chain'
import { useInscriptionsIsTrueChainStore } from '@/store'
import { BSC, useEthers } from '@usedapp/core'
import { useEffect } from 'react'

const useIsChainId = () => {
  const { isTrueChian, setIsTrueChain, setChainId, chainId } = useInscriptionsIsTrueChainStore()

  const { account } = useEthers()

  const chainChange = (chainId: any) => {
    setChainId(Number(chainId))
    console.log(Number(chainId), BSC.chainId)
    setIsTrueChain(Number(chainId) === BSC.chainId)
  }

  useEffect(() => {
    const ethereum = window.ethereum as any
    if (ethereum && account) {
      if (Number(ethereum.networkVersion) !== BSC.chainId) {
        switchChain('Default', false)
      }
      chainChange(Number(ethereum.networkVersion))
      ethereum.on('chainChanged', chainChange)
    }
    return () => {
      if (ethereum) {
        ethereum.removeListener('chainChanged', chainChange)
      }
    }
  }, [account])

  return {
    chainId,
    isTrueChainId: isTrueChian,
    chainChange,
  }
}

export default useIsChainId
