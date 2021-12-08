import React, { useCallback } from 'react'
import Transaction from './Transaction'
import { CheckCircle as CheckIcon, Copy as CopyIcon, ExternalLink as LinkIcon } from 'react-feather'
import useCopyClipboard from '../../../hooks/useCopyClipboard'
import { useCloseModals } from '../../../state/application/hooks'
import { getExplorerAddressLink, useEthers, useTransactions } from '@usedapp/core'
import { shorten } from '@funcblock/dapp-sdk'


function renderTransactions(transactions: string[]) {
  return (
    <div className="flex flex-col">
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </div>
  )
}

interface AccountDetailsProps {
  toggleWalletModal: () => void,
}

export default function AccountDetails({
                                         toggleWalletModal,
                                       }: AccountDetailsProps) {
  const { chainId, account, deactivate } = useEthers()
  const [isCopied, setCopied] = useCopyClipboard()
  const closeModals = useCloseModals()
  const { transactions } = useTransactions()

  const pendingTransactions = transactions.map(tx => tx.transaction.hash)
  const confirmedTransactions = transactions.map(tx => tx.transaction.hash).slice(0, 5)

  const onDisconnect = useCallback(() => {
    closeModals()
    setTimeout(() => {
      deactivate()
    }, 100)
  }, [deactivate, closeModals])

  if (!account || !chainId) {
    return null
  }
  return (
    <div>
      <div className="p-4 rounded bg-card-hover">
        <div className="flex flex-row justify-between items-center">
          <div className="text-sm text-light-grey">Connected</div>
          <div onClick={onDisconnect} className="rounded text-xs px-4 py-2 bg-card-hover2 text-red cursor-pointer">
            Disconnect
          </div>
        </div>
        <div className="py-4 text-lg flex flex-row justify-start items-center">
          <div>{shorten(account)}</div>
        </div>
        <div className="flex flex-row justify-between items-center text-sm">
          <div onClick={() => setCopied(account)} className="text-light-grey cursor-pointer">
            <div className="flex flex-row justify-between items-center">
              {isCopied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              <div className="pl-1">{isCopied ? 'Copied' : 'Copy Address'} </div>
            </div>
          </div>
          <a href={getExplorerAddressLink(account, chainId)} target="_blank" className="text-primary" rel="noreferrer">
            <div className="flex flex-row justify-between items-center">
              <LinkIcon size={16} />
              <div className="pl-1">View on Etherscan</div>
            </div>
          </a>
        </div>
      </div>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <div className="px-4 mt-4">
          <div className="text-light-grey">Recent Transactions</div>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </div>
      ) : null}
    </div>
  )
}
