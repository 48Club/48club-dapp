import { ApplicationModal } from '@/state/application/actions'
import { useCloseModals, useModalOpen } from '@/state/application/hooks'
import { Modal } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import metamask from '@/assets/images/wallet/metamask.svg'
import walletConnect from '@/assets/images/wallet/walletConnect.svg'
import { styled } from 'styled-components'
import { CHAIN_ID_HEX } from '@/constants/env'
import { useEthers } from '@usedapp/core'
const WalletItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 0px;
  border-radius: 12px;
  &:hover {
    background: rgba(34, 34, 34, 0.07);
  }
`

export default function WalletModal() {
  const modalOpen = useModalOpen(ApplicationModal.WALLET)
  const closeModals = useCloseModals()
  const { activateBrowserWallet } = useEthers()

  const activate = useCallback(
    async (type: string) => {
      try {
        if (window.ethereum && window.ethereum.request) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CHAIN_ID_HEX }],
          })
        }
      } catch (e) {
        console.error(e)
      }
      activateBrowserWallet({ type })
      closeModals()
    },
    [activateBrowserWallet]
  )

  return (
    <Modal
      open={modalOpen}
      onCancel={closeModals}
      transitionName=""
      centered
      destroyOnClose
      footer={null}
      width={320}
      closeIcon={null}
    >
      <div className="p-[20px] pr-[12px] pl-[12px]">
        <WalletItem onClick={() => activate('metamask')}>
          <img src={metamask} alt="" className="mr-[8px] rounded-[12px]" />
          MetaMask
        </WalletItem>
        <WalletItem onClick={() => activate('walletConnectV2')}>
          <img src={walletConnect} alt="" className="mr-[8px] rounded-[12px]" style={{}} /> WalletConnect
        </WalletItem>
      </div>
    </Modal>
  )
}
