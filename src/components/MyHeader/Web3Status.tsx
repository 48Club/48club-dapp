import { UnsupportedChainIdError } from '@web3-react/core'
import React, { useCallback } from 'react'
import { Activity } from 'react-feather'
import styled from 'styled-components'
import { Button } from 'antd'
import { useEthers, useTransactions } from '@usedapp/core'
import { useOpenModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import Loader from '../Loader'
import { shorten } from '@funcblock/dapp-sdk'

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

function Web3StatusInner({ pendingCount }: { pendingCount: number }) {
  const toggleWalletModal = useOpenModal(ApplicationModal.WALLET)
  const { activateBrowserWallet, error, account } = useEthers()

  const activate = useCallback(async () => {
    console.log(activateBrowserWallet)
    await activateBrowserWallet()
  }, [activateBrowserWallet])

  if (account) {
    return (
      <button className="bg-card py-2 px-4 text-white rounded" onClick={toggleWalletModal}>
        {pendingCount > 0 ? (
          <div className="flex flex-row justify-center items-center">
            <div className="pr-2">{pendingCount} Pending</div>
            <Loader stroke="#ffffff" />
          </div>
        ) : (
          <div>{shorten(account)}</div>
        )}
      </button>
    )
  } else if (error) {
    return (
      <Button onClick={() => activateBrowserWallet()}>
        <NetworkIcon />
        <div>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</div>
      </Button>
    )
  } else {
    return (
      <button className="bg-primary py-2 px-4 text-white rounded" onClick={activate}>
        <div>Connect Wallet</div>
      </button>
    )
  }
}

export default function Web3Status() {
  const { transactions } = useTransactions()

  return (
    <Web3StatusInner pendingCount={transactions.filter(i => !i.receipt).length} />
  )
}
