import React, { useCallback } from 'react'
import { useCloseModals, useKogeCount, useModalOpen } from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/actions'
import { Button, Modal } from 'antd'
import stake from '../../../assets/images/icon/stake.svg'
import useStake from '../../../hooks/staking/useStake'
import { formatAmount, TEN_POW } from '@funcblock/dapp-sdk'
import BigNumber from 'bignumber.js'
import useStakeInfo from '../../../hooks/staking/useStakeInfo'
import { useTranslation } from 'react-i18next'

export default function StakeModal() {
  const { t } = useTranslation()
  const modalOpen = useModalOpen(ApplicationModal.STAKE)
  const closeModals = useCloseModals()
  const kogeCount = useKogeCount()
  const { onStake, stakeLoading } = useStake()
  const { decimals, unstakeDelay } = useStakeInfo()

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
        <img className="w-16 h-16" src={stake} alt="" />
        <div className="mt-4 mb-2 text-xl font-bold">{`${t("confirm_stake_count")}${kogeCount}`}</div>
        <div className="text-base font-normal text-gray">{t("stake_description", {val: formatAmount(unstakeDelay / (60 * 60 * 24))})}</div>
        <div className="w-full mt-6 flex flex-row">
          <Button
            type="ghost"
            className="flex-1 h-10 mr-2"
            onClick={closeModals}
          >
            {t('cancel')}
          </Button>
          <Button
            type="primary"
            loading={stakeLoading}
            className="flex-1 h-10 ml-2"
            onClick={onSubmit}
          >
            {t('confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
