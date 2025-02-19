export const ZeroAddress = '0x0000000000000000000000000000000000000000'

const BNBChainId = 56
export const BNB0gweiChain: any = {
  chainId: '0x' + BNBChainId.toString(16),
  chainName: '48Club 0gwei MEV Protected',
  rpcUrls: ['https://0.48.club'],
  blockExplorerUrls: ['https://bscscan.com'],
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
}

export const BNB1gweiChain: any = {
  chainId: '0x' + BNBChainId.toString(16),
  chainName: '48Club MEV Protected',
  rpcUrls: ['https://rpc.48.club'],
  blockExplorerUrls: ['https://bscscan.com'],
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
}

const rpcGasMap = {
  '0Ggei': '0x1',
  'Default': '0x3b9aca00',
}

export const switchChain = async (type: '0Ggei' | 'Default', force: boolean) => {
  let switchChainValue: any
  if (type === '0Ggei') {
    switchChainValue = BNB0gweiChain
  } else {
    switchChainValue = BNB1gweiChain
  }

  const ethereum = window.ethereum as any
  if (ethereum) {
    try {

      const chainId = await ethereum.request({ method: 'eth_chainId' })

      if (force) {
        if (chainId == switchChainValue.chainId) {
          let gasPrice = await ethereum.request({
            "method": "eth_gasPrice",
            "params": [],
          })

          if (rpcGasMap[type] !== gasPrice) {
            console.log('need gas price:', rpcGasMap[type], ',current gas price:', gasPrice);
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [switchChainValue],
            })
          }
        }
      } else if (chainId == switchChainValue.chainId) {
        return
      } else {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [switchChainValue],
        })
      }
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
