import { DEPLOY_MINERS, DeployMinersProps } from '@/constants/inscriptions';
import { shorten } from '@funcblock/dapp-sdk';
import { Button, Modal, Form, Input, Radio, Checkbox, App as AntdApp, InputNumber } from 'antd'
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next'
import Miner from '../Miner';
import { useNavigate } from 'react-router-dom';
import { useEthers, useSendTransaction } from '@usedapp/core';

import * as utils from "web3-utils";

export const Deploy: React.FC<{
  open?: boolean;
  onClose?: () => void;
}> = ({ open, onClose }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [formMobile] = Form.useForm()

  const _onClose = () => {
    onClose?.()
  }

  const [miners, setMiners] = useState<string[]>(DEPLOY_MINERS.filter(miner => miner.defaultChecked)?.map(miner => miner.address) || []);

  const [tabType, setTabType] = useState("bnb-48");

  const [openMiners, setOpenMiners] = useState(false);

  const [openMobileMiners, setOpenMobileMiners] = useState(false)

  const nav = useNavigate()

  const { sendTransaction, state } = useSendTransaction()

  const { account } = useEthers()

  const minersNames = useMemo(() => {
    return DEPLOY_MINERS.filter(_miners => miners.includes(_miners.address))
  }, [miners])

  const [fromErr, setFromError] = useState({
    validateStatus: "success",
    help: ""
  })

  const { message, modal } = AntdApp.useApp()

  const delMiner = (miner: DeployMinersProps[number]) => {
    const index = miners.findIndex(m => m === miner.address);
    const newMiners = [...miners];
    newMiners.splice(index, 1);
    formMobile.setFieldValue('miners', newMiners)
    form.setFieldValue('miners', newMiners)
    setMiners(newMiners)
  }

  // const resetForm = () => {
  //   form.resetFields()
  //   formMobile.resetFields()
  //   setMiners([]);
  // }

  const onSubmit = () => {
    form.validateFields({ validateOnly: true }).then(res => {
      console.log(res, 'res')
      if (account === undefined) {
        modal.info({
          title: "",
          content: "Please Connect the Wallet First",
          wrapClassName: "alert-model-wrap",
          centered: true
        })
        return;
      }
      // if (isTrueChainId === false) {
      //   modal.info({
      //     title: "",
      //     content: "Wrong Network",
      //     wrapClassName: "alert-model-wrap",
      //     centered: true
      //   })
      //   return;
      // }

      // if (res.miners.length <= 0) {
      //   modal.error({
      //     title: "Error",
      //     content: "Please select at least one Miner",
      //     wrapClassName: "alert-model-wrap",
      //     centered: true
      //   })
      //   return;
      // }

      if (/^[a-zA-Z0-9]+$/.test(res.tick) === false) {
        modal.error({
          title: "Error",
          content: "Can only consist of uppercase and lowercase letters, and numbers. Maximum of 16 characters.",
          wrapClassName: "alert-model-wrap",
          centered: true
        })
        return;
      }

      if (res.totalSupply % res.limitPerMint !== 0) {
        setFromError({
          validateStatus: "error",
          help: "limit per mint must be divisible by total supply"
        })
        return;
      } else {
        setFromError({
          validateStatus: "success",
          help: ""
        })
      }

      const str = `data:,{
        "p":"${res.protocol}",
        "op":"deploy",
        "tick":"${res.tick}",
        "decimals":"${res.decimals}",
        "max":"${res.totalSupply * Math.pow(10, res.decimals)}",
        "lim":"${res.limitPerMint * Math.pow(10, res.decimals)}"
        ${res.miners.length > 0 ? `,"miners":${JSON.stringify(res.miners)}` : ''}
      }`
      console.log(str.replace(/\s*/g, ''), 'str')

      sendTransaction({
        to: account,
        value: utils.toWei(0, 'ether'),
        data: utils.stringToHex(str.replace(/\s*/g, '')),
      })
      // _onClose()
      // resetForm()
    }).catch((err) => {
      console.log(err)
      message.error("Please enter correct information")
    })
  }

  useEffect(() => {
    if(state.status === "Success") {
      message.success("Success")
    }
  }, [state.status])

  const [maxSupply, setMaxSupply] = useState<number>(21000000)

  const MinersTitleNode = <>
    <div className='flex-1 flex-wrap h-full flex items-center'>
      {
        minersNames.map(miner => {
          return <Miner className='mb-[16px]' key={miner.address} miner={miner} delMiner={() => delMiner(miner)} />
        })
      }
    </div>
    <div style={{ transform: openMiners ? 'rotate(180deg)' : 'rotate(0)' }} className=' transition-transform cursor-pointer w-[50px] h-full flex items-center justify-center'>
      <svg className=' cursor-pointer' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1677_16423)">
          <path d="M5 6L5 6.03208L8 10L11 6.03208L11 6L5 6Z" fill="#707A8A" />
        </g>
        <defs>
          <clipPath id="clip0_1677_16423">
            <rect width="16" height="16" fill="white" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 16 0)" />
          </clipPath>
        </defs>
      </svg>
    </div>
  </>

  const MinersNode = <>
    <Form.Item rules={[{ required: true }]} className='mb-[10px]' label={<>Miners <span className='ml-[12px] text-[12px] font-[400] text-[#E2B201]'>{miners.length} selected</span></>}>
      <div onClick={() => setOpenMiners(!openMiners)} className='pl-[12px] cursor-pointer w-full flex bg-[#F9F9F9] items-center justify-start py-[16px] pb-0 z-[2]'>
        {MinersTitleNode}
      </div>
    </Form.Item>
    <Form.Item initialValue={miners} style={{ height: openMiners ? (openMobileMiners ? '116.267vw' : 270) : 0, padding: openMiners ? '12px 12px' : '0 12px' }} className='w-full transition-all check-rouded-full diy-scrollbar overflow-y-scroll bg-[#F9F9F9]' name="miners">
      <Checkbox.Group style={{ width: '100%' }} value={miners} onChange={(val: any[]) => {
        setMiners(val);
        form.setFieldValue('miners', val)
        formMobile.setFieldValue('miners', val)
      }}>
        {
          DEPLOY_MINERS.map(miner => {
            return <div key={miner.address} className='w-full h-[24px] flex mb-[12px] items-center'>
              <Checkbox className='flex checkbox-center items-center' value={miner.address}>
                <span className='w-[100px] ml-[9px] inline-block check-label-text'>{miner.name.startsWith('0x') ? shorten(miner.name) : miner.name}</span>
                <span className='ml-[10px] inline-block text-[#A9A9A9]'>{openMobileMiners ? shorten(miner.address) : miner.address}</span>
              </Checkbox>
            </div>
          })
        }
      </Checkbox.Group>
    </Form.Item>
  </>

  const ContentNode = (
    <>
      <div className='md:h-[400px] px-[4px] diy-scrollbar md:overflow-y-scroll mb-[34px] pb-[40px] md:mb-[20px]'>
        <Form form={form} layout="vertical" size="large" preserve={false}>
          <Form.Item initialValue="bnb-48" name="protocol" label="Protocol">
            <Radio.Group onChange={(val) => setTabType(val.target.value)}>
              <Radio.Button value="bnb-48" style={{ background: tabType === 'bnb-48' ? '#fff' : '#E9E9E9' }} className=" leading-[40px] flex-1 h-[40px] text-center no-border">BNB-48</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="tick" rules={[{ required: true, message: "Please enter tick" }]} label="Tick">
            <Input
              maxLength={16}
              className="h-12 border-none rounded bg-light-white"
              placeholder={`Identifier of the token, like "fans"`}
            />
          </Form.Item>
          <Form.Item name="decimals" initialValue={8} rules={[{ required: true, message: "Please enter decimals" }]} label="Decimals">
            <InputNumber
              formatter={(value) => `${value}`.split('.')[0]}
              min={0}
              max={18}
              className="h-12 w-full border-none rounded bg-light-white"
              placeholder={`Decimals of the token, 0~18`}
            />
          </Form.Item>
          <Form.Item name="totalSupply" initialValue={21000000} rules={[{ required: true }]} label="Total Supply">
            <InputNumber
              formatter={(value) => `${value}`.split('.')[0]}
              min={1}
              value={maxSupply}
              onChange={(e: any) => setMaxSupply(e)}
              className="h-12 w-full border-none rounded bg-light-white"
              placeholder='21000000'
            />
          </Form.Item>
          <Form.Item initialValue={1000} validateStatus={fromErr.validateStatus as any} help={fromErr.help} name="limitPerMint" rules={[{ required: true }]} label="Limit per Mint">
            <InputNumber
              formatter={(value) => `${value}`.split('.')[0]}
              min={1}
              max={maxSupply}
              className="h-12 w-full border-none rounded bg-light-white"
              placeholder='100000'
            />
          </Form.Item>
          <Form.Item required rules={[{ required: true }]} className='mb-[10px] md:hidden block' label={<>Miners <span className='ml-[12px] text-[12px] font-[400] text-[#E2B201]'>{miners.length} selected</span></>}>
            <div onClick={() => {
              setOpenMobileMiners(true);
              setOpenMiners(true)
            }} className='pl-[12px] cursor-pointer w-full flex flex-wrap bg-[#F9F9F9] items-center justify-between pt-[16px] z-[2]'>
              {MinersTitleNode}
            </div>
          </Form.Item>
          <div className='md:hidden block'>
            <Form.Item className='h-0 my-0' name="miners"></Form.Item>
            <Modal
              open={openMobileMiners}
              onCancel={() => setOpenMobileMiners(false)}
              footer={false}
              closeIcon={null}
              width="91.733vw"
              className="rounded-xl"
              destroyOnClose
              centered
            >
              <div className="p-6 rounded-xl">
                <div className="relative text-center text-[#1E1E1E] text-xl font-bold">
                  Deploy
                  <img
                    src="/static/close.svg"
                    className="absolute top-0 right-0 transform -translate-y-1/2 cursor-pointer"
                    alt=""
                    onClick={() => setOpenMobileMiners(false)}
                  />
                </div>
                <Form form={formMobile} layout="vertical" size="large" preserve={false}>
                  {MinersNode}
                </Form>
              </div>
            </Modal>
          </div>
          <div className='md:block hidden'>
            {MinersNode}
          </div>
        </Form>
      </div>

      <div className="w-full flex justify-center gap-6 flex-wrap">
        <Button size="large" className="md:w-50 md:block hidden text-[14px] w-[158px] h-12 bg-gray rounded no-border" onClick={_onClose}>
          {t('pool_cancel')}
        </Button>
        <Button size="large" className="md:w-50 md:hidden block text-[14px] w-[158px] h-12 bg-gray rounded no-border" onClick={() => nav(-1)}>
          {t('pool_cancel')}
        </Button>
        <Button
          type="primary"
          size="large"
          loading={state.status === "Mining" || state.status === "PendingSignature"}
          className="md:w-50 w-[158px] h-12 text-[14px] rounded bg-yellow no-border"
          onClick={onSubmit}
        >
          Deploy
        </Button>
      </div>
    </>
  )

  return (
    <>
      <div className='md:hidden block'>
        <div className="flex items-center mt-[32px] mb-[20px]">
          <svg onClick={() => nav(-1)} className=" cursor-pointer" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="16" fill="#FFFBEC" />
            <path d="M15.828 21.0001L21.192 26.3641L19.778 27.7781L12 20.0001L19.778 12.2221L21.192 13.6361L15.828 19.0001L28 19.0001L28 21.0001L15.828 21.0001Z" fill="#A9A9A9" />
          </svg>
          <span className='text-[20px] leading-[24px] font-[700] ml-[16px]'>Deploy</span>
        </div>
        {ContentNode}
      </div>
      <div className='md:block hidden'>
        <Modal
          open={open}
          onCancel={() => {
            _onClose()
            form?.resetFields()
          }}
          footer={false}
          closeIcon={null}
          width={668}
          className="rounded-xl"
          destroyOnClose
          centered
        >
          <div className="p-6 rounded-xl">
            <div className="relative text-center text-[#1E1E1E] text-xl font-bold">
              Deploy
              <img
                src="/static/close.svg"
                className="absolute top-0 right-0 transform -translate-y-1/2 cursor-pointer"
                alt=""
                onClick={_onClose}
              />
            </div>
            {ContentNode}
          </div>
        </Modal>
      </div>
    </>
  )
}
