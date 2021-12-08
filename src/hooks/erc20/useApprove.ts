import { MaxUint256 } from '@ethersproject/constants'
import { useContractFunction } from '@usedapp/core'
import useERC20Contract from '../useContract'

export default function useApprove(token?: string, spender?: string) {
  const contract = useERC20Contract(token)
  const { send, state } = useContractFunction(contract!, 'approve', { transactionName: 'Approve' })

  const approve = async () => {
    await send(spender, MaxUint256.toString())
  }
  return {
    approve,
    loading: state.status === 'Mining',
  }
}
