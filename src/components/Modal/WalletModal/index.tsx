import { ApplicationModal } from '@/state/application/actions'
import { useCloseModals, useModalOpen } from '@/state/application/hooks'
import { Modal } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import metamask from '@/assets/images/wallet/metamask.svg'
import walletConnect from '@/assets/images/wallet/walletConnect.svg'
import { styled } from 'styled-components'
import { CHAIN_ID_HEX } from '@/constants/env'
import { useEthers } from '@usedapp/core'
import { LoadingOutlined } from '@ant-design/icons'
const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 12px 20px;
`

const WalletTitle = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 8px;
  > img {
    cursor: pointer;
  }
`

const WalletItem = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 8px 12px;
  border-radius: 12px;
  border: 1px solid rgb(234, 234, 234);
  &:hover {
    background: rgba(34, 34, 34, 0.07);
  }
`

const WalletList = [
  {
    type: 'metamask',
    src: metamask,
  },
  {
    type: 'walletConnectV2',
    src: walletConnect,
  },
]

export default function WalletModal() {
  const modalOpen = useModalOpen(ApplicationModal.WALLET)
  const closeGlobalModal = useCloseModals()
  const { activateBrowserWallet, account } = useEthers()
  const [isActive, setActive] = useState('')

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
      setActive(type)
      activateBrowserWallet({ type })
    },
    [activateBrowserWallet]
  )
  const closeModal = () => {
    closeGlobalModal()
    setActive('')
  }

  useEffect(() => {
    if (account) {
      setActive('')
      closeModal()
    }
  }, [account])

  return (
    <Modal
      open={modalOpen}
      onCancel={closeModal}
      transitionName=""
      centered
      mask={true}
      footer={null}
      width={320}
      closeIcon={null}
      zIndex={88}
    >
      <WalletTitle>
        <img src="/static/close.svg" alt="" onClick={closeModal} />
      </WalletTitle>
      <WalletContainer>
        {WalletList.map((idx, i) => {
          return (
            <WalletItem onClick={() => activate(idx.type)} key={i + 'WalletItem'}>
              <div className="flex items-center">
                <img src={idx.src} alt="" className="mr-[8px] rounded-[12px]" />
                {idx.type}
              </div>
              {isActive === idx.type && <LoadingOutlined />}
            </WalletItem>
          )
        })}
      </WalletContainer>
    </Modal>
  )
}
