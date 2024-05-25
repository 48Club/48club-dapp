import { Button, Input, Modal, Tooltip } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatAmount, TEN_POW } from '@funcblock/dapp-sdk'
import BigNumber from 'bignumber.js'
import { useEthers, useTokenAllowance } from '@usedapp/core'
import moment from 'moment'
import { HelpCircle } from 'react-feather'
import { useOpenModal } from '@/state/application/hooks'
import { ApplicationModal } from '@/state/application/actions'
import { KogeAddress, StakingAddress } from '@/constants/contracts'
import useStake from '@/hooks/staking/useStake'
import useStakeInfo from '@/hooks/staking/useStakeInfo'
import useApprove from '@/hooks/erc20/useApprove'
import Label from '@/components/Label'
import stake from '@/assets/images/icon/stake.svg'
import { useInscriptionbalance, useStakeInscriptionAcitons, useStakeInscriptionInfo } from '../../hooks'
import { defaultInscriptionStake } from '@/constants/inscriptions'
import { decimalsToStr } from '@/utils'
export default function StakingSection() {
  const { account } = useEthers()
  const { t } = useTranslation()
  const [activeItem, setActiveItem] = useState(0)
  const [input, setInput] = useState('')
  const [modalOpen, setmodalOpen] = useState(false)

  const closeModals = () => {
    setmodalOpen(false)
  }

  const navActive = (val: number) => {
    setInput('')
    setActiveItem(val)
  }
  const inputBN = useMemo(() => new BigNumber(input), [input])

  const { result, loading, updata } = useInscriptionbalance()

  const currentHash = result?.filter(
    (item) => item.tick_hash.toLocaleLowerCase() === defaultInscriptionStake.toLocaleLowerCase()
  )[0]

  const { balance, totalSupply } = useStakeInscriptionInfo()

  const { ontransfer, onredeem, transferLoading, redeemLoading } = useStakeInscriptionAcitons()

  const balanceAmount = useMemo(() => {
    if (!currentHash) return
    return currentHash.amount
  }, [currentHash])

  const redeemAmount = useMemo(() => {
    if (!balance) return
    // if (!balance || !currentHash) return
    return decimalsToStr(balance, 8)
  }, [currentHash, balance])

  const openStakeModal = useOpenModal(ApplicationModal.STAKE, inputBN.toString())
  const openUnstakeModal = useOpenModal(ApplicationModal.UNSTAKE, inputBN.toString())

  const onSubmit = useCallback(async () => {
    // if (!inputBN.gt(0) || !currentHash?.tick_hash) {
    //   return
    // }
    // if (!inputBN.gt(0) || !currentHash?.tick_hash) {
    //   return
    // }

    if (activeItem == 0) {
      // await ontransfer(currentHash.tick_hash, inputBN.times(TEN_POW(currentHash.decimals)).toFixed())
      await ontransfer(defaultInscriptionStake, inputBN.times(TEN_POW(8)).toFixed())
    } else if (activeItem === 1) {
      // await onredeem(inputBN.times(TEN_POW(currentHash.decimals)).toFixed())
      await onredeem(inputBN.times(TEN_POW(8)).toFixed())
    }
  }, [, inputBN, , activeItem, openStakeModal, openUnstakeModal])

  const currentBalance = useMemo(() => {
    return [balanceAmount, redeemAmount][activeItem]
  }, [balanceAmount, redeemAmount, activeItem])

  const onSetMax = useCallback(() => {
    setInput(currentBalance?.toFixed() ?? '0')
  }, [setInput, currentBalance])

  return (
    <div className="flex flex-col">
      <Label text={t('staking_staking_title')} />
      <div className="mt-6 w-auto flex flex-col md:flex-row rounded-lg shadow">
        <div className="flex-1 flex flex-col pl-8 bg-card-yellow">
          <div>
            <div className="font-medium text-base mr-3 mt-10 mb-4">{t('my_staking_count')}</div>
            <div className="text-2xl font-bold mb-4">{formatAmount(balance, currentHash?.decimals || 8)} IKOGE</div>
          </div>
          <div className="flex flex-row items-center text-sm mt-6 mb-4">
            <div>
              <div className="font-medium mb-1 mr-10">{t('my_unstaking_count')}</div>
              <div className="flex flex-row items-center">{formatAmount(0, currentHash?.decimals || 8)} IKOGE</div>
            </div>
            <div>
              <div className="font-medium mb-1">{t('my_withdrawable_count')}</div>
              <div className="">0 IKOGE</div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-6 mb-20">
          <div className="flex flex-row mt-10 mb-6">
            <div
              className={`py-2 px-4 font-medium text-base text-center rounded border-2 cursor-pointer ${
                activeItem === 0 ? 'border-yellow' : 'border-transparent'
              }`}
              onClick={() => navActive(0)}
            >
              {t('staking')}
            </div>
            <div
              className={`py-2 px-4 font-medium text-base text-center rounded border-2 cursor-pointer ${
                activeItem === 1 ? 'border-yellow' : 'border-transparent'
              }`}
              onClick={() => navActive(1)}
            >
              Redeem
            </div>
          </div>
          <div className="flex flex-row justify-between h-12">
            <Input
              suffix={
                <span className="text-base text-primary cursor-pointer" onClick={onSetMax}>
                  MAX
                </span>
              }
              placeholder={`${t('balance')}: ${formatAmount(currentBalance, 0)} IKOGE`}
              className="h-12 mb-6 text-base mr-6 bg-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {
              <Tooltip placement="top">
                <Button
                  type="primary"
                  className="h-full rounded"
                  onClick={onSubmit}
                  loading={transferLoading || redeemLoading}
                  // disabled={inputBN.gt(currentBalance || 0) || !inputBN.gt(0)}
                >
                  {t('confirm')}
                </Button>
              </Tooltip>
            }
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onCancel={closeModals} footer={null} width={440} closeIcon={null}>
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          <img className="w-16 h-16" src={stake} alt="" />
          <div className="mt-4 mb-2 text-xl font-bold">{`${t('confirm_stake_count')}${312}`}</div>
          <div className="text-base font-normal text-gray">
            {t('stake_description', { val: formatAmount(1 / (60 * 60 * 24)) })}
          </div>
          <div className="w-full mt-6 flex flex-row">
            <Button className="flex-1 h-10 mr-2" onClick={closeModals}>
              {t('cancel')}
            </Button>
            <Button type="primary" loading={false} className="flex-1 h-10 ml-2" onClick={onSubmit}>
              {t('confirm')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
