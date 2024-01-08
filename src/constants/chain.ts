import { BSC } from '@usedapp/core'

export const ZeroAddress = '0x0000000000000000000000000000000000000000'

const BNBChainId = 56
export const BNB1geiChain: any = {
  chainId: '0x' + BNBChainId.toString(16),
  chainName: BSC.chainName,
  rpcUrls: ['https://1gwei.48.club'],
  blockExplorerUrls: ['https://bscscan.com'],
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
}

export const BNB3geiChain: any = {
  chainId: '0x' + BNBChainId.toString(16),
  chainName: BSC.chainName,
  rpcUrls: ['https://rpc-bsc.48.club'],
  blockExplorerUrls: ['https://bscscan.com'],
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
}

export const BNBDefaultChain: any = {
  chainId: '0x' + BNBChainId.toString(16),
  chainName: BSC.chainName,
  rpcUrls: BSC.rpcUrl,
  blockExplorerUrls: [BSC.blockExplorerUrl],
  nativeCurrency: BSC.nativeCurrency,
}

export const switchChain = async (type: '1Ggei' | '3Ggei' | 'Default') => {
  let switchChainValue: any
  if (type === '1Ggei') {
    switchChainValue = BNB1geiChain
  } else if (type === '3Ggei') {
    switchChainValue = BNB3geiChain
  } else {
    switchChainValue = BNBDefaultChain
  }

  const ethereum = window.ethereum as any

  if (ethereum) {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: switchChainValue.chainId,
          },
        ],
      })
    } catch (error) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [switchChainValue],
      })
    }
  } else {
    alert('Please Install Metamask')
  }
}

export const sendTransaction = (param: any) => {
  const ethereum = window.ethereum as any
  if (ethereum) {
    return ethereum.request({
      method: 'eth_sendTransaction',
      params: [param],
    })
  } else {
    alert('Please Install Metamask')
  }
}
