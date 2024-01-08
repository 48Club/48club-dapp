import { SearchResultList, useInscriptionsBetchTransferState } from '@/store'
import { Button, Input, InputNumber, Space, Tooltip, Typography, App as AntdApp, Radio, Form, Modal } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useInscriptionsSearchState } from '@/store'
import { shorten } from '@funcblock/dapp-sdk'
import { useEthers, useSendTransaction } from '@usedapp/core'
import * as utils from 'web3-utils'
import { decimalsToStr, strToDecimals } from '@/utils'
import { useNavigate, useParams } from 'react-router-dom'
import inscriptionsApi from '@/utils/request'
import { useTranslation } from 'react-i18next'
import { ExplorerDataProps } from '@/utils/request.type'
import useIsChainId from '@/hooks/hooks/useChainId'
let instance: ReturnType<typeof Modal.error> | undefined
const Recap: React.FC = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const nav = useNavigate()

  const { message, modal } = AntdApp.useApp()

  const { sendTransaction, state } = useSendTransaction()

  const { account } = useEthers()

  const [maxSupply, setMaxSupply] = useState<number>(21000000)

  const param = useParams()

  const [loading, setLoading] = useState(false)

  const [detail, setDetail] = useState<ExplorerDataProps>({} as ExplorerDataProps)

  const getDetail = async () => {
    setLoading(true)
    inscriptionsApi
      .getInscriptionsDetail({
        tick_hash: param.hash,
        page: 1,
      })
      .then((res) => {
        setLoading(false)
        if (res.code === 0 && res.data.list.length > 0) {
          const _detail = res.data.list[0]
          setDetail(_detail)
          form.setFieldsValue({
            decimals: _detail.decimals,
            totalSupply: decimalsToStr(_detail.max, _detail.decimals),
            minted: decimalsToStr(_detail.minted, _detail.decimals),
          })
        } else {
          if (instance === undefined) {
            instance = Modal.error({
              title: 'Error!',
              content: 'No data found',
              okText: 'Back',
              wrapClassName: 'alert-model-wrap',
              onOk() {
                instance = undefined
                nav(-1)
              },
            })
          }
        }
      })
      .catch((err) => {
        setLoading(false)
        console.log(err, 'err')
      })
  }

  useEffect(() => {
    const hash = param.hash
    if (hash?.startsWith('0x')) {
      getDetail()
    } else {
      nav('/')
    }
  }, [param.id])

  const { isTrueChainId } = useIsChainId()

  const onSubmit = () => {
    form
      .validateFields({ validateOnly: true })
      .then((res) => {
        console.log(res, 'res')
        if (account === undefined) {
          modal.info({
            title: '',
            content: 'Please Connect the Wallet First',
            wrapClassName: 'alert-model-wrap',
            centered: true,
          })
          return
        }
        if (isTrueChainId === false) {
          modal.info({
            title: '',
            content: 'Wrong Network',
            wrapClassName: 'alert-model-wrap',
            centered: true,
          })
          return
        }
        const limitPerMint = +decimalsToStr(detail.lim, detail.decimals)

        if (res.newTotalSupply % limitPerMint !== 0) {
          modal.info({
            title: '',
            content: 'limit per mint must be divisible by total supply',
            wrapClassName: 'alert-model-wrap',
            centered: true,
          })
          return
        }

        const oldMax = +decimalsToStr(detail.max, detail.decimals)
        if (res.newTotalSupply >= oldMax) {
          modal.info({
            title: '',
            content: 'Increasing is not allowed.',
            wrapClassName: 'alert-model-wrap',
            centered: true,
          })
          return
        }

        const str = `data:,{
        "p"."bnb-48"
        "op":"recap".
        "tick-hash":"${detail.tick_hash}",
        "max":"${strToDecimals(res.newTotalSupply, detail.decimals)}"
      }`
        console.log(str.replace(/\s*/g, ''), 'str')

        sendTransaction({
          to: account,
          value: utils.toWei(0, 'ether'),
          data: utils.stringToHex(str.replace(/\s*/g, '')),
        })
        // _onClose()
        // resetForm()
      })
      .catch((err) => {
        console.log(err)
        message.error('Please enter correct information')
      })
  }

  useEffect(() => {
    if (state.status === 'Success') {
      message.success('Success')
    }
  }, [state.status])

  return (
    <>
      <div className="mt-[36px] mb-[24px]  flex gap-[8px] just max-w-[800px]">
        <svg
          onClick={() => nav('/inscriptions/account')}
          className=" cursor-pointer"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="16" fill="#FFFBEC" />
          <path
            d="M15.828 21.0001L21.192 26.3641L19.778 27.7781L12 20.0001L19.778 12.2221L21.192 13.6361L15.828 19.0001L28 19.0001L28 21.0001L15.828 21.0001Z"
            fill="#A9A9A9"
          />
        </svg>

        <div className="md:text-[24px] text-[18px] font-[700] flex items-center leading-[28px] text-[#E2B201]">
          {detail?.tick}
          <Typography.Paragraph className="m-[0_!important]" copyable={{ text: detail?.tick_hash }}>
            ({shorten(detail?.tick_hash)})
          </Typography.Paragraph>
          <span className="ml-[8px] px-[6px] h-[17px] leading-[17px] font-[400] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">
            {detail?.protocol}
          </span>
        </div>
      </div>

      <div className=" mt-[24px]  pb-[24px]   shadow    pl-[24px] pr-[24px]">
        <Form form={form} layout="vertical" size="large" preserve={false}>
          <Form.Item name="decimals" label="Decimals">
            <InputNumber readOnly className="h-12 w-full border-none rounded bg-light-white text-[#FFC801]" />
          </Form.Item>
          <Form.Item name="minted" label="Minted">
            <InputNumber readOnly className="h-12 w-full border-none rounded bg-light-white text-[#FFC801]" />
          </Form.Item>
          <Form.Item name="totalSupply" label="Max Supply">
            <InputNumber readOnly className="h-12 w-full border-none rounded bg-light-white text-[#FFC801]" />
          </Form.Item>
          <Form.Item
            name="newTotalSupply"
            initialValue={21000000}
            rules={[{ required: true, message: 'Please enter new max supply' }]}
            label="New Max Supply"
          >
            <InputNumber
              formatter={(value) => `${value}`.split('.')[0]}
              min={1}
              value={maxSupply}
              onChange={(e: any) => setMaxSupply(e)}
              className="h-12 w-full border-none rounded bg-light-white"
              placeholder="21000000"
            />
          </Form.Item>
        </Form>

        <div className="w-full flex justify-center gap-6 flex-wrap">
          <Button
            size="large"
            className="md:w-50 md:block hidden text-[14px] w-[158px] h-12 bg-gray rounded no-border"
            onClick={() => nav('/inscriptions/account')}
          >
            {t('pool_cancel')}
          </Button>
          <Button
            size="large"
            className="md:w-50 md:hidden block text-[14px] w-[158px] h-12 bg-gray rounded no-border"
            onClick={() => nav('/inscriptions/account')}
          >
            {t('pool_cancel')}
          </Button>
          <Button
            type="primary"
            size="large"
            loading={state.status === 'Mining' || state.status === 'PendingSignature'}
            className="md:w-50 w-[158px] h-12 text-[14px] rounded bg-yellow no-border"
            onClick={onSubmit}
          >
            Recap
          </Button>
        </div>
      </div>
    </>
  )
}

export default Recap
