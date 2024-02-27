import Column from '@/components/Column'
import Row, { RowBetween } from '@/components/Row'
import { KogeAddress } from '@/constants/contracts'
import useApprove from '@/hooks/erc20/useApprove'
import { useWrappedContract } from '@/hooks/useContract'
import { ArrowDownOutlined } from '@ant-design/icons'
import { useEthers, useTokenAllowance } from '@usedapp/core'
import { Button, Input } from 'antd'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWrapAcitons, useWrapTokenInfo } from '../hooks'
import { useCallback, useMemo, useState } from 'react'
import { BN, fromWei, toWei } from '@/utils/bn'
import { formatAmount } from '@funcblock/dapp-sdk'
const WrappedBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
  height: 100%;
`
const ContainerBox = styled.div`
  box-shadow: 0 0 #0000, 0 0 #0000, 0px 0.5rem 1.5rem rgba(0, 0, 0, 0.06);
  width: 400px;
  background: #fff;
  border-radius: 24px;
  padding: 30px 24px;
`
const MyImage = styled.img`
  width: 24px;
`

const Wrapped = () => {
  const { account } = useEthers()

  const warpContract = useWrappedContract()
  const { approve: onApprove, loading: approveLoading } = useApprove(KogeAddress, warpContract.address)
  const allowance = new BigNumber(useTokenAllowance(KogeAddress, account, warpContract.address)?.toString() ?? '0')

  const [reversal, setreversal] = useState(false)
  const [input, setInput] = useState('')

  const { onWarp, unWarp, warpLoading, unWarpLoading } = useWrapAcitons()

  const { kogeBalance, kogedecimals, ikogeBalance, ikogedecimals } = useWrapTokenInfo()

  const InputBalance = useMemo(() => {
    return reversal ? fromWei(ikogeBalance || 0, ikogedecimals) : fromWei(kogeBalance || 0, kogedecimals)
  }, [kogeBalance, reversal, ikogeBalance])

  const OutputBalance = useMemo(() => {
    return reversal ? fromWei(kogeBalance || 0, kogedecimals) : fromWei(ikogeBalance || 0, ikogedecimals)
  }, [kogeBalance, reversal, ikogeBalance])

  const inputsymbol = reversal ? 'IKOGE' : 'KOGE'
  const outymbol = reversal ? 'KOGE' : 'IKOGE'

  const amountMax = () => {
    setInput(InputBalance.toFixed())
  }

  const onAdd = useCallback(async () => {
    if (!warpContract || !KogeAddress) return
    if (reversal) {
      await unWarp(KogeAddress, toWei(input))
    } else {
      await onWarp(toWei(input))
    }
  }, [warpContract, reversal, onWarp, unWarp, KogeAddress])
  return (
    <WrappedBox>
      <ContainerBox>
        <RowBetween className="mb-[6px]">
          <Row width="auto">
            <MyImage src="/static/logo-koge.png" /> <div className="">{inputsymbol}</div>
          </Row>
          <div>Balance: {formatAmount(InputBalance)}</div>
        </RowBetween>
        <Column>
          <Input
            className="h-12 border-none rounded bg-[#e9e9e9] "
            value={input}
            onChange={(e) => setInput(e.target.value)}
            suffix={
              <span className="text-primary text-sm  cursor-pointer" onClick={amountMax}>
                {InputBalance.eq(input) ? '' : 'MAX'}
              </span>
            }
          />
          <div className="pt-[24px] size-[24px]  cursor-pointer">
            <ArrowDownOutlined size={40} onClick={() => setreversal(!reversal)} />
          </div>

          <RowBetween className="mb-[6px]">
            <Row width="auto">
              <MyImage src="/static/logo-koge.png" /> <div className="">{outymbol}</div>
            </Row>
            <div>Balance: {formatAmount(OutputBalance)}</div>
          </RowBetween>
          <div className="h-12 border-none rounded bg-[#e9e9e9] h-[48px] w-[100%] flex  items-center pl-[11px]">
            {input}
          </div>
        </Column>

        <div className="mt-[32px]">
          {!allowance.gt(0) ? (
            <Button className="h-12 rounded border-btn w-[100%]" onClick={onApprove} loading={approveLoading}>
              Approve
            </Button>
          ) : (
            <Button
              disabled={!BN(input).lt(InputBalance) || BN(input).lte(0)}
              type="primary"
              size="large"
              className="w-[100%] h-12 rounded"
              onClick={onAdd}
              loading={reversal ? unWarpLoading : warpLoading}
            >
              Wrap
            </Button>
          )}
        </div>
      </ContainerBox>
    </WrappedBox>
  )
}

export default Wrapped
