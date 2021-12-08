import React from 'react'
import { ApplicationModal } from '../../../state/application/actions'
import { useCloseModals, useModalOpen, useOpenModal } from '../../../state/application/hooks'
import AccountDetails from './AccountDetails'
import { Modal } from 'antd'
import { useEthers } from '@usedapp/core'

export default function WalletModal() {
  const { modalOpen } = useModalOpen(ApplicationModal.WALLET)
  const openModal = useOpenModal(ApplicationModal.WALLET)
  const closeModals = useCloseModals()

  const { account, error } = useEthers()

  function getHeader() {
    if (error) {
      return <>{error.message}</>
    }
    if (account) {
      return 'My Wallet'
    }
    return 'Connect to a wallet'
  }

  function getBody() {
    if (error) {
      return 'Error connecting. Try refreshing the page.'
    }
    if (account) {
      return <AccountDetails
        toggleWalletModal={openModal}
      />
    }
  }

  return (
    <Modal visible={modalOpen} onCancel={closeModals} footer={null} title={getHeader()}>
      <div className="p-4">
        {getBody()}
      </div>
    </Modal>
  )
}
