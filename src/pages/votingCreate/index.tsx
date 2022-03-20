import { Button, Input, Select } from 'antd'
import Back from 'components/Back'
import React, { useCallback, useState } from 'react'
import useNftInfo from '../../hooks/nft/useNftInfo'
import useGov from '../../hooks/gov/useGov'
import useGovInfo from '../../hooks/gov/useGovInfo'
import { formatAmount, TEN_POW } from '@funcblock/dapp-sdk'
import BigNumber from 'bignumber.js'
import useApprove from '../../hooks/erc20/useApprove'
import { GovernanceAddress, KogeAddress } from '../../constants/contracts'
import { useEthers, useTokenAllowance } from '@usedapp/core'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input

export default function VotingCreate() {
  const { account } = useEthers()
  const { onPropose } = useGov()
  const { minDeposit } = useGovInfo()
  const { myNFTs } = useNftInfo()
  const [nft, setNft] = useState<string | undefined>()
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const { t } = useTranslation()

  const { approve, loading: approveLoading } = useApprove(KogeAddress, GovernanceAddress)
  const allowance = new BigNumber(useTokenAllowance(KogeAddress, account, GovernanceAddress)?.toString() ?? '0')
  const amountBN = new BigNumber(amount).times(TEN_POW(18))

  const onSubmit = useCallback(async () => {
    if (nft === undefined || !amountBN.gt(0)) {
      return
    }
    await onPropose(nft, amountBN.toString(), desc)
  }, [nft, desc, amountBN, onPropose])

  return (
    <div className="px-4 max-w-2xl mx-auto relative">
      <Back />
      <div className="mt-4 px-6 md:mt-8 rounded-2xl flex flex-col items-center" style={{ backgroundColor: '#FFFBEC' }}>
        <span className="mt-10 font-bold text-2xl mb-4 text-light-black">{t('create')} KOGE {t('proposal')}</span>
        <span className="text-base mb-12 text-dark-gray">{t('koge_desc')}</span>
      </div>

      <div className="flex flex-col mt-10">
        <span className="text-sm font-medium mb-2 text-light-black">{t('choose')}</span>
        <Select value={nft} className="w-full h-12 rounded border-none bg-light-white" style={{ backgroundColor: '#F9F9F9' }} size="large" onChange={e => setNft(e)}>
          {
            myNFTs.filter(i => !i.isInUse).map(i => <Select.Option className="h-10 flex items-center" value={i.id}>{i.id} | {i.name}</Select.Option>)
          }
        </Select>
      </div>

      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">{t('description')}</span>
        <TextArea rows={4} placeholder={t('please_input')} className="border-none rounded text-sm text-light-black bg-light-white" value={desc} onChange={e => setDesc(e.target.value)} />
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:gap-4">
        <div className="flex flex-col mt-12 md:w-1/2">
          <span className="text-sm font-medium mb-2 text-light-black">{t('voting_type')}</span>
          <Input value={t('single_choice').toString()} className="h-12 border-none rounded text-sm text-light-black bg-light-white" disabled />
        </div>
        <div className="flex flex-col mt-12 md:w-1/2">
          <span className="text-sm font-medium mb-2 text-light-black">{t('voting_period')}</span>
          <Input value={t('seven_days').toString()} className="h-12 border-none rounded text-sm text-light-black bg-light-white" disabled />
        </div>
      </div>

      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">{t('options')}</span>
        <div className="flex flex-col md:flex-row md:justify-between md:gap-4">
          <Input value={t('op1').toString()} className="h-12 rounded border-none text-sm mb-2 md:mb-0 text-light-black bg-light-white" disabled />
          <Input value={t('op2').toString()} className="h-12 rounded border-none text-sm text-light-black bg-light-white" disabled />
        </div>
      </div>

      <div className="flex flex-col mt-12">
        <span className="text-sm mb-2 text-light-black">{t('pay')} ({t('min')}: {formatAmount(minDeposit, 18)})</span>
        <Input className="h-12 border-none rounded text-sm text-light-black bg-light-white" suffix="KOGE" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>

      <div className="w-full mt-12 mb-20">
        {
          !allowance.gt(0) &&
          <Button className="h-12 rounded w-full bg-yellow rounded text-light-black" onClick={approve} loading={approveLoading}>
            {t('approve')}
          </Button>
        }
        <Button className="h-12 rounded w-full bg-yellow rounded text-light-black" onClick={onSubmit}
                disabled={!minDeposit?.lt(amountBN) || !allowance.gt(0)}>
          {t('submit')}
        </Button>
      </div>
    </div>
  )
}
