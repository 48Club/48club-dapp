import { TransactionResponse } from '@ethersproject/providers'
import { getExplorerTransactionLink, useNotifications } from '@usedapp/core'
import { ReactElement } from 'react'
import { CheckCircle, CheckSquare, Clock, ExternalLink, XCircle } from 'react-feather'
import { TransactionReceipt } from '@ethersproject/abstract-provider'

// Notification['type']
const notificationContent: { [key in any]: { title: string; icon: ReactElement } } = {
  transactionFailed: { title: 'Transaction failed', icon: <XCircle size={28} /> },
  transactionStarted: { title: 'Transaction started', icon: <Clock size={28} /> },
  transactionSucceed: { title: 'Transaction succeed', icon: <CheckCircle size={28} /> },
  walletConnected: { title: 'Wallet connected', icon: <CheckSquare size={28} /> },
}

interface NotificationElementProps {
  icon: ReactElement
  title: string | undefined
  transaction?: TransactionResponse
}

const NotificationElement = ({ transaction, icon, title }: NotificationElementProps) => {
  return (
    <div className="flex flex-row items-center px-4 py-4 bg-card-hover shadow mb-4 rounded w-64">
      <div className="mr-3">{icon}</div>
      <div className="flex flex-col">
        <div className="text-base font-bold">{title}</div>
        {
          transaction && (
            <a
              href={getExplorerTransactionLink(transaction.hash, transaction.chainId)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex flex-row justify-start items-center opacity-50"
            >
              <div className="mr-1">View on Explorer</div>
              <ExternalLink size={18} />
            </a>
          )
        }
      </div>
    </div>
  )
}

interface FilteredNotification {
  id: string,
  type: 'transactionSucceed' | 'transactionFailed'
  transaction: TransactionResponse
  receipt: TransactionReceipt
  transactionName?: string
}

export const NotificationsList = () => {
  const { notifications } = useNotifications()
  const filteredNotifications = notifications.filter(i => ['transactionSucceed', 'transactionFailed'].includes(i.type)) as FilteredNotification[]
  return (
    <div className="fixed right-0 top-0 pr-8 pb-2 mt-24">
      {filteredNotifications.map((notification) => (
        <NotificationElement
          key={notification.id}
          icon={notificationContent[notification.type].icon}
          title={notification.transactionName}
          transaction={notification.transaction}
        />
      ))}
    </div>
  )
}

