import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { Button, Modal, ModalProps, Form, Input, Select, DatePicker, message } from 'antd'
import { useToken } from '@usedapp/core'
import Bignumber from 'bignumber.js'
import { TEN_POW } from '@funcblock/dapp-sdk'
import moment from 'moment'
import { usePoolFactory, stakingList } from '../../../hooks/pool/usePool'
import { useCreatePoolShow, useRewardTokenSymbolList } from '../../../store/index'
import { useTranslation } from 'react-i18next'

const { Option } = Select

export const CreatePoolModal = (props: Pick<ModalProps, 'visible' | 'onCancel'>) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { poolType, poolMeta, hide } = useCreatePoolShow()

  const [stakingToken, setStakingToken] = useState(poolMeta.stakingToken)
  const [rewardToken, setRewardToken] = useState(poolMeta.rewardToken)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [amount, setAmount] = useState('')
  const rewardTokenData = useToken(rewardToken)

  const {
    deployLoading,
    onDeploy,
    onApprove,
    approveLoading,
    onContribute,
    contributeLoading,
    isAllowed,
    rewardBalance,
  } = usePoolFactory(rewardToken)

  const amountBN = useMemo(() => new Bignumber(amount).times(TEN_POW(18)), [amount])
  const timeGap = useMemo(() => new Bignumber(endTime).minus(new Bignumber(startTime)), [endTime, startTime])
  const rewardRate = useMemo(() => {
    if (!(endTime && startTime)) {
      return new Bignumber(0)
    } else {
      return amountBN.div(timeGap)
    }
  }, [amountBN, endTime, startTime, timeGap])

  useEffect(() => {
    setStakingToken(poolMeta.stakingToken)
    setRewardToken(poolMeta.rewardToken)
  }, [poolMeta])

  const onSubmit = useCallback(async () => {
    if (poolType === 1 && !(stakingToken && rewardToken && amount && endTime && startTime)) {
      console.error('Please complete form')
      return
    }

    if ((poolType === 2 || (poolType === 3 && poolMeta.status === 2)) && !(amount && startTime)) {
      console.error('Please complete form')
      return
    }

    if (!amount) {
      console.error('Please complete form')
      return
    }

    if (!isAllowed) {
      await onApprove()
    }

    if (poolType === 1 && !rewardRate.gt(0)) {
      message.error('Please set the correct time range')
      return
    }

    if (poolType === 1 && stakingToken) {
      await onDeploy({
        stakingToken,
        rewardToken,
        rewardRate: rewardRate.toFixed(0),
        amount: new Bignumber(rewardRate.toFixed(0)).times(timeGap).toString(),
        startTime,
      })
    } else {
      const currentAmount = new Bignumber(poolMeta.rewardRate).times(
        new Bignumber(amount).div(poolMeta.rewardRate).toFixed(0)
      )

      await onContribute({
        poolId: poolMeta.poolId!,
        amount: new Bignumber(currentAmount).times(TEN_POW(18)).toString(),
        startTime: startTime ? startTime : (Date.now() / 1000).toFixed(0),
      })
    }

    window.setTimeout(hide, 400)
  }, [
    amount,
    endTime,
    hide,
    isAllowed,
    onApprove,
    onContribute,
    onDeploy,
    poolMeta.poolId,
    poolMeta.rewardRate,
    poolMeta.status,
    poolType,
    rewardRate,
    rewardToken,
    stakingToken,
    startTime,
    timeGap,
  ])

  const rewardMax = useCallback(async () => {
    if (isAllowed) {
      setAmount(new Bignumber(rewardBalance).toFixed(0))
      form.setFieldValue('amount', new Bignumber(rewardBalance).toFixed(0))
    }
  }, [form, isAllowed, rewardBalance])

  return (
    <Modal
      visible={props.visible}
      onCancel={(e) => {
        props.onCancel?.(e)
        form?.resetFields()
      }}
      footer={false}
      closeIcon={null}
      className="rounded-xl"
      destroyOnClose
    >
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

        <Form form={form} layout="vertical" size="large" initialValues={poolMeta} preserve={false}>
          <Form.Item name="stakingToken" label={t('pool_staking_currency')}>
            <Select
              key="stakingToken"
              className="h-12 border-none rounded bg-light-white"
              placeholder={t('pool_select')}
              disabled={poolType !== 1}
              onChange={(e) => {
                setStakingToken(e)
              }}
            >
              {stakingList.map((i) => (
                <Option key={i.token} value={i.token}>
                  {i.text}
                </Option>
              ))}
            </Select>
            {/* <Input
              key="stakingToken"
              className="h-12 border-none rounded bg-light-white"
              placeholder={t('pool_input')}
              readOnly={poolType !== 1}
              onChange={(e) => setStakingToken(e.target.value)}
            /> */}
          </Form.Item>
          <Form.Item name="rewardToken" label={t('pool_reward_currency')}>
            <Input
              className="h-12 border-none rounded bg-light-white"
              placeholder={t('pool_input')}
              readOnly={poolType !== 1}
              onChange={(e) => {
                setRewardToken(e.target.value.length === 42 ? e.target.value : '')
              }}
              suffix={<div>{rewardTokenData?.symbol ?? ''}</div>}
            />
          </Form.Item>
          <Form.Item name="amount" label={t('pool_reward_amount')}>
            <Input
              className="h-12 border-none rounded bg-light-white"
              placeholder={t('pool_input')}
              onChange={(e) => setAmount(e.target.value)}
              suffix={
                <span className="text-primary text-sm font-bold cursor-pointer" onClick={rewardMax}>
                  {isAllowed ? 'MAX' : ''}
                </span>
              }
            />
          </Form.Item>
          {poolType !== 1 && (
            <Form.Item name="rewardRate" label={t('pool_rate')}>
              <Input className="h-12 border-none rounded bg-light-white" placeholder={t('pool_input')} disabled />
            </Form.Item>
          )}
          {(poolType === 1 || poolMeta.status === 2) && (
            <Form.Item name="startTime" label={t('pool_start_time')}>
              <DatePicker
                placeholder={t('pool_select')}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                className="w-full h-12 border-none rounded bg-light-white"
                disabledDate={(current) => {
                  return current && current < moment().startOf('date')
                }}
                onChange={(e) => {
                  if (e) {
                    setStartTime((e.valueOf() / 1000).toFixed(0))
                  }
                }}
              />
            </Form.Item>
          )}
          {poolType === 1 && (
            <Form.Item name="endTime" label={t('pool_end_time')}>
              <DatePicker
                placeholder={t('pool_select')}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                className="w-full h-12 border-none rounded bg-light-white"
                disabledDate={(current) => {
                  return !startTime ? false : current < moment.unix(Number(startTime)).startOf('date')
                }}
                onChange={(e) => {
                  if (e) {
                    setEndTime((e.valueOf() / 1000).toFixed(0))
                  }
                }}
              />
            </Form.Item>
          )}
        </Form>

        <div className="w-full flex justify-center gap-6 flex-wrap">
          <Button size="large" className="w-50 h-12 bg-gray rounded" onClick={props.onCancel}>
            {t('pool_cancel')}
          </Button>
          <Button
            type="primary"
            size="large"
            className="w-50 h-12 rounded"
            loading={approveLoading || deployLoading || contributeLoading}
            onClick={onSubmit}
          >
            {t('pool_confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
