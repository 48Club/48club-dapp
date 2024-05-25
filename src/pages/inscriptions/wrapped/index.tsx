import Column from '@/components/Column'
import Row, { RowBetween } from '@/components/Row'
import { KogeAddress, wrappedAddress, wrappedToken } from '@/constants/contracts'
import useApprove from '@/hooks/erc20/useApprove'
import { useWrappedContract } from '@/hooks/useContract'
import { ArrowDownOutlined } from '@ant-design/icons'
import { useEthers, useTokenAllowance } from '@usedapp/core'
import { Button, Input } from 'antd'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWrapAcitons, useWrapTokenInfo } from '../hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BN, fromWei, toWei } from '@/utils/bn'
import { formatAmount } from '@funcblock/dapp-sdk'
import inscriptionsApi from '@/utils/request'
import { decimalsToStr } from '@/utils'
import { AccountBalanceDataProps } from '@/utils/request.type'
const WrappedBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
  height: 100%;
  flex-direction: column;
  align-items: center;
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

const Text = styled.div`
  width: 400px;
`

const Wrapped = () => {
  const { account } = useEthers()

  const tickHash = '0xd893ca77b3122cb6c480da7f8a12cb82e19542076f5895f21446258dc473a7c2' // fans
  const [userBlance, setResult] = useState<any | undefined>()
  const warpContract = useWrappedContract()
  const { approve: onApprove, loading: approveLoading } = useApprove(wrappedToken, warpContract.address)
  const allowance = new BigNumber(useTokenAllowance(wrappedToken, account, warpContract.address)?.toString() ?? '0')

  const [reversal, setreversal] = useState(false)
  const [input, setInput] = useState('')

  const { onWarp, unWarp, warpLoading, unWarpLoading } = useWrapAcitons()

  const { kogeBalance, kogedecimals, ikogeBalance } = useWrapTokenInfo()

  const InputBalance = useMemo(() => {
    return reversal ? fromWei(userBlance?.amount || 0, 0) || 0 : fromWei(kogeBalance || 0, kogedecimals)
  }, [kogeBalance, reversal, ikogeBalance, userBlance])

  const OutputBalance = useMemo(() => {
    return reversal ? fromWei(kogeBalance || 0, kogedecimals) : fromWei(userBlance?.amount || 0, 0)
  }, [kogeBalance, reversal, ikogeBalance, userBlance])

  const inputsymbol = reversal ? 'fans' : 'bfans'
  const outymbol = reversal ? 'bfans' : 'fans'

  const amountMax = () => {
    setInput(InputBalance.toFixed())
  }

  const getBlances = useCallback(() => {
    if (!account) return
    inscriptionsApi
      .getUserBalances({
        address: account,
        tick_hash: [tickHash],
      })
      .then((res) => {
        if (res.code === 0) {
          const walletList = res.data.wallet
            .map((item) => {
              return {
                ...item,
                amount: decimalsToStr(item.balance, item?.decimals),
              }
            })
            .filter((amount) => amount.tick_hash.toLocaleLowerCase() === tickHash.toLocaleLowerCase())
          setResult(walletList[0])
        }
      })
  }, [account])

  useEffect(() => {
    if (!account) return
    const timer = setInterval(() => {
      getBlances()
    }, 1000)
    getBlances()
    return () => clearInterval(timer)
  }, [account])

  const onAdd = useCallback(async () => {
    if (!warpContract) return
    try {
      if (reversal) {
        await unWarp(tickHash, toWei(input, 8))
      } else {
        await onWarp(tickHash, toWei(input, 8))
      }
    } catch (error) {
      console.log(error)
    }
    setInput('')
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
                {InputBalance?.eq(input) ? '' : 'MAX'}
              </span>
            }
          />
          <div>
            <div className="pt-[24px] size-[24px]  cursor-pointer flex">
              <ArrowDownOutlined size={40} onClick={() => setreversal(!reversal)} />
            </div>
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
          {BN(input).gt(0) && !reversal && !allowance.gt(0) ? (
            <Button className="h-12 rounded border-btn w-[100%]" onClick={onApprove} loading={approveLoading}>
              Approve
            </Button>
          ) : (
            <Button
              disabled={!BN(input).lte(InputBalance) || BN(input).lte(0)}
              type="primary"
              size="large"
              className="w-[100%] h-12 rounded"
              onClick={onAdd}
              loading={reversal ? unWarpLoading : warpLoading}
            >
              {reversal ? 'UnWarp' : 'Wrap'}
            </Button>
          )}
        </div>
      </ContainerBox>
    </WrappedBox>
  )
}

export default Wrapped
