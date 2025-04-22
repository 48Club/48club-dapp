import { message } from 'antd'
import { MaxUint256 } from '@ethersproject/constants'
import { useContractFunction } from '@usedapp/core'
import useERC20Contract from '../useContract'
import { useCallback, useEffect } from 'react'

export default function useApprove(token?: string, spender?: string) {
  const contract = useERC20Contract(token)
  const { send, state } = useContractFunction(contract!, 'approve', { transactionName: 'Approve' })

  // 统一监听所有状态
  const handleStateChange = useCallback((state: any, actionName: string) => {
    if (state.status === 'Success') {
      message.success(`${actionName} successful`)
    } else if (state.status === 'Exception' || state.status === 'Fail') {
      if (state.errorMessage) {
        message.error(state.errorMessage)
      } else {
        message.error(`${actionName} failed`)
      }
    }
  }, [])
  // 监听所有状态变化
  useEffect(() => {
    handleStateChange(state, 'Approve')
  }, [state.status, state.errorMessage])
  const approve = async () => {
    await send(spender, MaxUint256.toString())
  }
  return {
    approve,
    loading: state.status === 'Mining',
  }
}
