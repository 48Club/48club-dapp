import React, { useCallback } from 'react'
import { useCloseModals, useKogeCount, useModalOpen } from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/actions'
import { Modal } from 'antd'
import stake from '../../../assets/images/icon/stake.svg'
import useStake from '../../../hooks/staking/useStake'
import { TEN_POW } from '@funcblock/dapp-sdk'
import BigNumber from 'bignumber.js'
import useStakeInfo from '../../../hooks/staking/useStakeInfo'

export default function StakeModal() {
  const modalOpen = useModalOpen(ApplicationModal.STAKE)
  const closeModals = useCloseModals()
  const kogeCount = useKogeCount()
  const { onStake, stakeLoading, onUnstake, unstakeLoading, onWithdraw, withdrawLoading } = useStake()
  const { decimals } = useStakeInfo()

  const onSubmit = useCallback(async () => {
    if (!kogeCount || !decimals) {
      return
    }
    await onStake(new BigNumber(kogeCount).times(TEN_POW(decimals)))
    closeModals()
  }, [onStake, kogeCount, decimals, closeModals])

  return (
    <Modal visible={modalOpen} onCancel={closeModals} footer={null} width={440} closeIcon={null}>
      <div className="flex flex-col items-center pt-8 pb-6 px-6">
        <img className="w-16 h-16" src={stake} />
        <div className="mt-4 mb-2 text-xl font-bold">{`请确认质押KOGE代币数量为：${kogeCount}`}</div>
        <div className="text-base font-normal text-gray">质押成功后，您的KOGE将于48天后方可解除质押。</div>
        <div className="w-full mt-6 flex flex-row">
          <div className="flex-1 bg-gray h-10 flex items-center justify-center mr-2 rounded cursor-pointer hover:opacity-75" onClick={closeModals}>取消</div>
          <div className="flex-1 bg-yellow h-10 flex items-center justify-center rounded cursor-pointer hover:opacity-75" onClick={onSubmit}>确认</div>
        </div>
      </div>
    </Modal>
  )
}
