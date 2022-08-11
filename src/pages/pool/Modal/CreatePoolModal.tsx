import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { Button, Modal, ModalProps, Form, Input, Select, DatePicker } from 'antd'
import Bignumber from 'bignumber.js'
import { TEN_POW } from '@funcblock/dapp-sdk'
import { usePoolFactory } from '../../../hooks/pool/usePool'
import { useCreatePoolShow, useStakeOrClaim } from '../../../store/index'
import { useTranslation } from 'react-i18next'

export const CreatePoolModal = (props: Pick<ModalProps, 'visible' | 'onCancel'>) => {
  const { t } = useTranslation()
  const { poolType, poolMeta } = useCreatePoolShow()
  const [stakingToken, setStakingToken] = useState(poolMeta.stakingToken || '')
  const [rewardToken, setRewardToken] = useState(poolMeta.rewardToken || '')
  const [rewardRate, setRewardRate] = useState(poolMeta.rewardRate || '')
  const [startTime, setStartTime] = useState('')
  const [amount, setAmount] = useState('')
  const { deployLoading, onDeploy, onApprove, approveLoading, onContribute, contributeLoading, isAllowed } =
    usePoolFactory(rewardToken)

  useEffect(() => {
    setStakingToken(poolMeta.stakingToken)
    setRewardToken(poolMeta.rewardToken)
    setRewardRate(poolMeta.rewardRate)
  }, [poolMeta])

  const onSubmit = useCallback(async () => {
    if (!(stakingToken && rewardToken && amount && rewardRate && startTime)) {
      console.error('complete form')
      return
    }

    if (!isAllowed) {
      await onApprove()
    }

    if (poolType === 1) {
      await onDeploy({
        stakingToken,
        rewardToken,
        rewardRate: new Bignumber(rewardRate).times(TEN_POW(18)).toString(),
        amount: new Bignumber(amount).times(TEN_POW(18)).toString(),
        startTime,
      })
    } else {
      console.log(poolMeta.poolId)
      await onContribute({
        poolId: poolMeta.poolId,
        amount: new Bignumber(amount).times(TEN_POW(18)).toString(),
        startTime,
      })
    }
  }, [
    amount,
    isAllowed,
    onApprove,
    onContribute,
    onDeploy,
    poolMeta.poolId,
    poolType,
    rewardRate,
    rewardToken,
    stakingToken,
    startTime,
  ])

  return (
    <Modal {...props} footer={false} closeIcon={null} className="rounded-xl" destroyOnClose>
      <div className="p-6 rounded-xl">
        <div className="relative text-center text-[#1E1E1E] text-xl font-bold">
          {poolType === 1 ? t('pool_btn_text') : poolType === 2 ? t('pool_restart_pool') : t('pool_append_pool')}
          <img
            src="/static/close.svg"
            className="absolute top-0 right-0 transform -translate-y-1/2 cursor-pointer"
            alt=""
            onClick={props.onCancel}
          />
        </div>

        <Form layout="vertical" size="large" initialValues={poolMeta}>
          <Form.Item name="stakingToken" label={t('pool_staking_currency')}>
            {/* <Select className="h-12 border-none rounded bg-light-white" placeholder="请选择" /> */}
            <Input
              key="stakingToken"
              className="h-12 border-none rounded bg-light-white"
              placeholder={t('pool_input')}
              readOnly={poolType !== 1}
              onChange={(e) => setStakingToken(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="rewardToken" label={t('pool_reward_currency')}>
            <Input
              className="h-12 border-none rounded bg-light-white"
              placeholder={t('pool_input')}
              readOnly={poolType !== 1}
              onChange={(e) => setRewardToken(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="amount" label={t('pool_reward_amount')}>
            <Input
              className="h-12 border-none rounded bg-light-white"
              placeholder={t('pool_input')}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="rewardRate" label={t('pool_rate')}>
            <Input
              className="h-12 border-none rounded bg-light-white"
              placeholder={t('pool_input')}
              readOnly={poolType !== 1}
              onChange={(e) => setRewardRate(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="startTime" label={t('pool_start_time')}>
            <DatePicker
              placeholder={t('pool_select')}
              format="YYYY-MM-DD HH:mm:ss"
              className="h-12 border-none rounded bg-light-white"
              onChange={(e) => {
                if (e) {
                  setStartTime((e.valueOf() / 1000).toFixed(0))
                }
              }}
            />
          </Form.Item>
        </Form>

        <div className="w-full flex justify-center gap-6 flex-wrap">
          <Button size="large" className="w-50 h-12 bg-gray rounded" onClick={props.onCancel}>
            {t('pool_cancel')}
          </Button>
          <Button
            type="primary"
            size="large"
            className="w-50 h-12 rounded"
            loading={approveLoading || deployLoading}
            onClick={onSubmit}
          >
            {t('pool_confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
