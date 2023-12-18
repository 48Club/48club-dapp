import { useCallback } from 'react'
import { useCloseModals, useKogeCount, useModalOpen } from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/actions'
import { Button, Modal } from 'antd'
import unStake from '../../../assets/images/icon/unStake.svg'
import useStake from '../../../hooks/staking/useStake'
import { formatAmount, TEN_POW } from '@funcblock/dapp-sdk'
import BigNumber from 'bignumber.js'
import useStakeInfo from '../../../hooks/staking/useStakeInfo'
import { useTranslation } from 'react-i18next'

export default function UnStakeModal() {
  const { t } = useTranslation()
  const modalOpen = useModalOpen(ApplicationModal.UNSTAKE)
  const closeModals = useCloseModals()
  const kogeCount = useKogeCount()
  const { onUnstake, unstakeLoading } = useStake()
  const { decimals, withdrawDelay } = useStakeInfo()

  const onSubmit = useCallback(async () => {
    if (!kogeCount || !decimals) {
      return
    }
    await onUnstake(new BigNumber(kogeCount).times(TEN_POW(decimals)))
    closeModals()
  }, [onUnstake, kogeCount, decimals, closeModals])

  return (
    <Modal open={modalOpen} onCancel={closeModals} footer={null} width={440} closeIcon={null}>
      <div className="flex flex-col items-center pt-8 pb-6 px-6">
        <img className="w-16 h-16" src={unStake} alt="" />
        <div className="mt-4 mb-2 text-xl font-bold">{`${t('confirm_unstake_count')}${kogeCount}`}</div>
        <div className="text-base font-normal text-gray">{t('unstake_description', { val: formatAmount(withdrawDelay / (60 * 60 * 24)) })}</div>
        <div className="w-full mt-6 flex flex-row">
          <Button
            className="flex-1 h-10 mr-2"
            onClick={closeModals}
          >
            {t('cancel')}
          </Button>
          <Button
            type="primary"
            loading={unstakeLoading}
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
