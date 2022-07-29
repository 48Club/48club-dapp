import React, { useCallback } from 'react'
import { Tag, Button, message } from 'antd'
import { usePool } from '../../../hooks/pool/usePool'
import { useStakeShow, useStakeOrClaim } from '../../../store'

export const PoolCardSection = () => {
  return (
    <div className="flex flex-wrap gap-6 mb-30 <sm:justify-center">
      <PoolCard pool={{}} userDetail={{}} />
    </div>
  )
}

function PoolCard({ pool, userDetail }: { pool: any; userDetail: any }) {
  const { onApprove, isAllowed, approveLoading, myBalance, stakePoolLoading } = usePool()
  const [stakeShow, setStakeShow] = useStakeShow()
  const { setCurrentType } = useStakeOrClaim()

  const claimHandler = () => {
    message.success('恭喜您，奖励领取成功。', 10)
  }

  const handleApprove = useCallback(() => {
    if (!isAllowed) {
      onApprove()
    } else {
      setStakeShow(true)
      setCurrentType(1)
    }
  }, [isAllowed, onApprove, setCurrentType, setStakeShow])

  return (
    <div className="relative w-80 flex-col py-10 px-8 shadow rounded-xl bg-white">
      <Tag color="#EF2B2B" className="absolute top-0 left-8 transform -translate-y-1/2 rounded border-none text-sm">
        即将开始
      </Tag>
      <div className="relative flex flex-col items-center">
        <img src="/static/pool_avatar.svg" alt="" />
        <img src="/static/autorenew.svg" className="absolute bottom-0 right-50% transform translate-x-full" alt="" />
      </div>
      <div className="flex flex-col items-center mt-8 font-bold text-lg">
        <span>质押LP（Cake-BNB）</span>
        <span>奖励Koge</span>
      </div>
      <div className="pt-8 pb-6 border-b border-solid">
        <div className="flex justify-between text-sm">
          <span className="text-dark-gray">发行总量：1,123.7634 Koge</span>
          <span className="text-primary underline underline-primary">追加资金</span>
        </div>
        <div className="mt-2 text-dark-gray text-sm">释放速率：1block - 3个</div>
      </div>
      <div className="py-6 flex justify-between text-sm">
        <span className="">我的奖励：23.7634 Koge</span>
        <span className="text-primary underline underline-primary" onClick={claimHandler}>
          领取奖励
        </span>
      </div>

      <div className="w-full flex gap-4">
        <Button
          type="primary"
          loading={stakePoolLoading || approveLoading}
          size="large"
          className="h-12 flex-1 rounded"
          onClick={handleApprove}
        >
          {isAllowed ? '质押' : '授权'}
        </Button>
        {isAllowed && (
          <Button size="large" disabled className="h-12 flex-1 rounded">
            解质押
          </Button>
        )}
      </div>
    </div>
  )
}
