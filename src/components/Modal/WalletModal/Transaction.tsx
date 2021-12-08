import React from 'react'
import styled from 'styled-components'
import { CheckCircle, Triangle } from 'react-feather'
import { Spin } from 'antd'
import { getExplorerTransactionLink, useEthers, useTransactions } from '@usedapp/core'

const TransactionWrapper = styled.div``

const TransactionStatusText = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;

  :hover {
    text-decoration: underline;
  }
`

type TransactionProperties = {
  pending: boolean,
  success?: boolean
}

const TransactionState = styled('a')<TransactionProperties>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  color: ${({ theme }) => theme.primary1};
`

const IconWrapper = styled.div<TransactionProperties>`
  color: ${({ pending, success, theme }) => (pending ? theme.color.primary : success ? '#367A3D' : '#CA3E35')};
`

export default function Transaction({ hash }: { hash: string }) {
  const { chainId } = useEthers()
  const { transactions } = useTransactions()
  const tx = transactions?.[hash]
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

  if (!chainId) {
    return null
  }

  return (
    <TransactionWrapper>
      <TransactionState href={getExplorerTransactionLink(hash, chainId)} target="_blank" pending={pending} success={success}>
        <div className="flex flex-row justify-center items-center">
          <TransactionStatusText>{summary ?? hash} ↗</TransactionStatusText>
        </div>
        <IconWrapper pending={pending} success={success}>
          {pending ? <Spin /> : success ? <CheckCircle size="16" /> : <Triangle size="16" />}
        </IconWrapper>
      </TransactionState>
    </TransactionWrapper>
  )
}
