import { SearchResultList, useInscriptionsBetchTransferState } from "@/store";
import { Button, Input, InputNumber, Space, Tooltip, Typography, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { InfoCircleOutlined } from '@ant-design/icons'
import { useInscriptionsSearchState } from "@/store";
import { shorten } from "@funcblock/dapp-sdk";
import { useEthers, useSendTransaction } from "@usedapp/core";
import * as utils from "web3-utils";
import { decimalsToStr, strToDecimals } from "@/utils";


const BatchTransfer: React.FC = () => {

    const { betchTransferState } = useInscriptionsBetchTransferState()

    const [addressStrList, setAddressStrList] = useState<string>('')

    const [enterAddress, setAddress] = useState('')
    const [amount, setAmount] = useState('')

    const { sendTransaction, state } = useSendTransaction()

    const { result, searchText } = useInscriptionsSearchState()

    const { account } = useEthers()

    const currentTick = useMemo(() => {
        if (result) {
            return result.find(res => res.tick_hash === betchTransferState?.tick_hash);
        } else {
            return {} as SearchResultList;
        }
    }, [result])

    const addressListValue = useMemo(() => {
        if (addressStrList) {
            const addressStrs = addressStrList.split('\n');
            const _addressList = addressStrs.map(add => {
                const [address, amount] = add.replace(/\s*/g, '').split(',');
                return {
                    address,
                    amount
                }
            })

            return _addressList;
        }
        return []
    }, [addressStrList])

    useEffect(() => {
        if (enterAddress && amount) {
            setAddressStrList(`${enterAddress},${amount}`)
        } else {
            setAddressStrList('')
        }
    }, [enterAddress, amount])

    const betchTransfer = () => {
        console.log(betchTransferState, currentTick, 'betchTransferState')
        if (currentTick === undefined || currentTick?.amount === undefined) {
            message.error("Please select a token")
            return;
        }

        if (currentTick?.amount - +amount < 0 || +amount <= 0) {
            message.error("Invalid Balance")
            return;
        }

        const str = `data:,
        {
          "p":"${currentTick.protocol}",
          "op":"transfer",
          "tick-hash":"${currentTick.tick_hash}",
          "to":"${enterAddress}",
          "amt":"${strToDecimals(+amount, currentTick.decimals)}"
        }`
        console.log(str.replace(/\s*/g, ''), 'str')
        sendTransaction({
            to: enterAddress,
            value: utils.toWei(0, 'ether'),
            data: utils.stringToHex(str.replace(/\s*/g, '')),
        })
    }

    useEffect(() => {
        if (state.status === "Success") {
            message.success("Success")
        }
    }, [state.status])

    const chooseMyWallet = searchText === account;

    const hasOkMoney = currentTick?.amount ? (currentTick?.amount - +amount >= 0) : false;

    return <div className="w-full mt-[24px] md:mt-0 md:ml-[24px] shadow py-[32px]">
        <div className="px-[32px]">
            <div className="md:text-[24px] text-[18px] font-[700] flex items-center leading-[28px] text-[#E2B201]">
                {currentTick?.tick}<Typography.Paragraph className="m-[0_!important]" copyable={{ text: currentTick?.tick_hash }}>({shorten(currentTick?.tick_hash)})</Typography.Paragraph><span className="ml-[8px] px-[6px] h-[17px] leading-[17px] font-[400] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">{currentTick?.protocol}</span>
            </div>
            {/* <p className="text-[12px] font-[400] leading-[24px] mt-[4px] text-[#A9A9A9]">Enter one address and amount on each line, separated with commas.</p> */}
            <p className="text-[12px] font-[400] leading-[24px] mt-[4px] text-[#A9A9A9]">Enter the address and amount in the blank.</p>
            <p>Address</p>
            <Input value={enterAddress} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" />
            <p>Amount</p>
            <InputNumber controls={false} className="w-full" min={(currentTick?.decimals ? decimalsToStr(1, currentTick?.decimals) : 0).toString()} value={amount} onChange={(val) => val && setAmount(val)} placeholder="Enter amount" />
            {/* <Input.TextArea value={addressStrList} onChange={(e) => setAddressStrList(e.target.value)} className="px-[24px] py-[6px] text-[14px] font-[400] leading-[20px] bg-[#F9F9F9] rounded-[4px] no-border mt-[24px] md:mt-[12px]" rows={8} placeholder={`0x2b1F577230F4D72B3818895688b66abD9701B4dC,141421\n0x2b1F577230F4D72B3818895688b66abD9701B4dC,141421\n0x2b1F577230F4D72B3818895688b66abD9701B4dC,141421`}></Input.TextArea> */}
            <h1 className="text-[24px] font-[700] leading-[28px] mt-[32px] text-[#1E1E1E]">Confirm</h1>
            <div className="mt-[24px] flex text-[14px] font-[400] leading-[20px] text-[#A9A9A9] justify-between">
                <span>address</span>
                <span>amount</span>
            </div>
        </div>
        <div className="px-[32px]"><div className="block h-[1px] w-full bg-[#EAEAEA] mt-[12px]"></div></div>
        <div className="px-[32px] overflow-y-scroll py-[12px] text-[12px] font-[400] h-[56px]">
            {
                addressListValue.map(add => {

                    let isNotAddress = false;
                    try {
                        utils.toChecksumAddress(add.address);
                        isNotAddress = false;
                    } catch (error) {
                        isNotAddress = true;
                    }
                    const hasAddress = addressListValue.filter(i => i.address === add.address).length > 1;

                    const isError = isNotAddress || hasAddress;

                    return <div key={add.address} style={{ color: isNotAddress ? "#EF2B2B" : hasAddress ? '#ffc801' : undefined }} className="flex md:h-[26px] items-center justify-between md:my-0 my-[8px]">
                        <Space className="md:w-full w-[205px] break-all">
                            {add.address}
                            {
                                isError && <Tooltip trigger={["hover"]} placement="topLeft" title={isNotAddress ? "Invalid address" : hasAddress ? "Detected the same address as others!" : undefined}>
                                    <InfoCircleOutlined className=" cursor-pointer" />
                                </Tooltip>
                            }

                        </Space>
                        <span>{add.amount}</span>
                    </div>
                })
            }
        </div>
        <div className="px-[32px]"><div className="block h-[1px] w-full bg-[#EAEAEA]"></div></div>
        <div className="px-[32px]">
            <div className="mt-[24px] text-[12px]">
                <p className="flex justify-between leading-[18px]">
                    <span>Total</span>
                    <span>{amount}</span>
                </p>
                <p className="flex justify-between mt-[12px] leading-[18px]">
                    <span>Your balance</span>
                    <span>{currentTick?.amount || '-'}</span>
                </p>
                <p style={{ color: hasOkMoney ? 'green' : '#EF2B2B' }} className="flex justify-between mt-[12px] leading-[18px]">
                    <span>Remaining</span>
                    <span>{currentTick?.amount ? (currentTick?.amount - +amount) : '-'}</span>
                </p>
            </div>
            <Button loading={state.status === "Mining" || state.status === "PendingSignature"} onClick={betchTransfer} disabled={chooseMyWallet === false || !hasOkMoney} type="primary" className="mt-[24px] h-[48px] disabled:hover:h-[48px] disabled:h-[48px] no-border bg-yellow disabled:border-none disabled:bg-[#E9E9E9] disabled:text-[#1E1E1E]" block>{chooseMyWallet ? (hasOkMoney ? "Batch Transfer" : "Invalid Balance") : 'Not Your Wallet'}</Button>
        </div>

    </div>
}

export default BatchTransfer;
