import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import { useCallback } from 'react'

export default function useSignMessage() {
  const { library, account } = useEthers()

  const signMessage = useCallback(async (message: string) => {
    if (!library || !account) {
      throw new Error('Please connect your wallet first')
    }

    try {
      console.log(account, 'account')
      // 创建 Web3Provider
      const provider = new ethers.providers.Web3Provider(window.ethereum as any)
      const signer = provider.getSigner()
      
      // 签名消息
      const signature = await signer.signMessage(message)
      
      return signature
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign message')
    }
  }, [library, account])

  return {
    signMessage
  }
} 