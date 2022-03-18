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

const { TextArea } = Input

export default function VotingCreate() {
  const { account } = useEthers()
  const { onPropose } = useGov()
  const { minDeposit } = useGovInfo()
  const { myNFTs } = useNftInfo()
  const [nft, setNft] = useState<string | undefined>()
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')

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
    <div className="px-4 max-w-2xl mx-auto">
      <Back />
      <div className="mt-4 rounded-2xl flex flex-col items-center" style={{ backgroundColor: '#FFFBEC' }}>
        <span className="mt-8 font-bold text-2xl mb-4 text-light-black">Create KOGE Proposal</span>
        <span className="text-base mb-10 text-dark-gray">KOGE voting will determine the direction of governance</span>
      </div>
      <div className="flex flex-col mt-10">
        <span className="text-sm font-medium mb-2 text-light-black">Choose NFT</span>
        <Select value={nft} className="w-full rounded" onChange={e => setNft(e)}>
          {
            myNFTs.map(i => <Select.Option value={i.id}>{i.id} | {i.name}</Select.Option>)
          }
        </Select>
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">Description</span>
        <TextArea rows={4} placeholder="Please input" className="rounded text-sm text-light-black" value={desc} onChange={e => setDesc(e.target.value)} />
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">Voting type</span>
        <Input value="Single choice" className="rounded text-sm text-light-black" disabled />
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">Voting Period</span>
        <Input value="7 Days" className="rounded text-sm text-light-black" disabled />
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">Options</span>
        <Input value="Option1: Approve" className="rounded text-sm mb-2 text-light-black" disabled />
        <Input value="Option2: Reject" className="rounded text-sm text-light-black" disabled />
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm mb-2 text-light-black">Pay (min: {formatAmount(minDeposit, 18)})</span>
        <Input className="rounded font-medium text-sm text-light-black" suffix="KOGE" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>

      <div className="w-full mt-12 mb-20">
        {
          !allowance.gt(0) ? (
            <Button className="h-12 rounded w-full bg-yellow rounded text-light-black" onClick={approve} loading={approveLoading}>
              Approve
            </Button>
          ) : (
            <Button className="h-12 rounded w-full bg-yellow rounded text-light-black" onClick={onSubmit} disabled={!minDeposit?.lt(amountBN)}>
              Submit
            </Button>
          )
        }
      </div>
    </div>
  )
}
