import { Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Miner from "../explorer/Miner";
import { useEffect, useMemo } from "react";
import moment from "moment";
import { DEPLOY_MINERS } from "@/constants/inscriptions";
import * as utils from "web3-utils";
import { useEthers, useSendTransaction } from "@usedapp/core";
import { decimalsToStr } from "@/utils";
import { ExplorerDataProps } from "@/utils/request.type";

const ExplorerDetailHeader: React.FC<{
    detail: ExplorerDataProps
}> = ({ detail }) => {

    const nav = useNavigate()

    const { account } = useEthers()

    const { sendTransaction, state } = useSendTransaction()

    const param = useParams()

    const miners = useMemo(() => {
        if (detail?.miners) {
            const _minersStr = detail.miners.split(',');
            const _miners = DEPLOY_MINERS.filter(miner => _minersStr.includes(miner.address));
            return _miners;
        } else {
            return []
        }
    }, [detail])

    const openLink = (link: string) => {
        window.open(link, "_blank")
    }

    const mint = () => {

        const str = `data:,{
            "p":"${detail.protocol}",
            "op":"mint",
            "tick-hash":"${param.id}",
            "amt":"${detail.lim}"
        }`

        sendTransaction({
            to: account,
            value: utils.toWei(0, 'ether'),
            data: utils.stringToHex(str.replace(/\s*/g, '')),
        })
    }

    useEffect(() => {
        if (state.status === "Success") {
            message.success("Success")
        }
    }, [state.status])

    const parseData = useMemo(() => {
        if (detail) {
            const getNumberByData = (data: number) => {
                return decimalsToStr(data, detail.decimals).toFixed(2)
            }
            const maxSupply = getNumberByData(detail.max)
            const minted = getNumberByData(detail.minted)
            return {
                lim: getNumberByData(detail.lim),
                maxSupply: maxSupply,
                progress: ((detail.minted / detail.max) * 100).toFixed(2),
                minted: minted,
                hasOver: minted >= maxSupply
            }
        } else {
            return {
                lim: 0,
                maxSupply: 0,
                progress: 0,
                minted: 0
            };
        }
    }, [detail])

    return <div className="">
        <div className="flex items-center">
            <svg onClick={() => nav(-1)} className=" cursor-pointer" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="16" fill="#FFFBEC" />
                <path d="M15.828 21.0001L21.192 26.3641L19.778 27.7781L12 20.0001L19.778 12.2221L21.192 13.6361L15.828 19.0001L28 19.0001L28 21.0001L15.828 21.0001Z" fill="#A9A9A9" />
            </svg>
            <div className="flex ml-[16px] items-center">
                <h1 className="text-[20px] font-[700] leading-[24px] text-[rgba(226,178,1,1)]">{detail.tick}</h1>
                <span className="ml-[8px] text-[12px] md:text-[10px] leading-[12px] px-[6px] py-[4px] text-[#1E1E1E] bg-[rgba(217,217,217,0.4)] rounded-full">{detail.protocol}</span>
            </div>
        </div>
        <div className="mt-[32px] mb-[24px] flex items-center">
            <div className="flex-1 h-[12px] md:h-[9px] overflow-hidden rounded-full bg-[rgba(255,200,1,.2)]">
                <div style={{ width: `${parseData.progress}%` }} className="h-full rounded-full bg-[#FFC801]"></div>
            </div>
            <span className="ml-[12px] text-[16px] font-[400] leading-[24px] text-[#1E1E1E]">{parseData.progress}%</span>
        </div>
        <div className="w-full pb-[32px] shadow">
            <div className="h-[104px] w-full flex items-center justify-between border px-[32px] border-transparent border-b-[#EAEAEA]">
                <h1 className="text-[24px] md:text-[20px] font-[700] leading-[104px]">Overview</h1>
                <Button disabled={parseData.hasOver} loading={state.status === "Mining" || state.status === "PendingSignature"} onClick={mint} type="primary" className="md:w-[152px]  disabled:hover:h-[40px] disabled:h-[40px] w-[96px] h-[40px] bg-yellow">Mint</Button>
            </div>
            <div className="h-full mt-[32px] px-[24px] md:px-[32px] text-[14px] font-[400]">
                <p className="w-full flex flex-col md:flex-row md:items-center justify-between">
                    <span className=" leading-[20px] text-[#A9A9A9]">Tick-hash</span>
                    <span onClick={() => openLink(`https://bscscan.com/tx/${param.id}`)} className=" flex items-center leading-[20px] text-[#1E1E1E] cursor-pointer underline">
                        <span className="md:w-auto w-[275px] break-all">{param.id}</span>
                        <svg className="ml-[8px] cursor-pointer" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.2387 7.24886V10.873C11.2387 11.4835 10.7256 12 10.1193 12H1.11938C0.513048 12 0 11.4835 0 10.873V1.81258C0 1.20217 0.513048 0.685669 1.11938 0.685669H4.71935C4.99574 0.685669 5.23931 0.929136 5.23931 1.20739C5.23931 1.48563 4.99747 1.73084 4.71935 1.73084H1.11938C1.06755 1.73084 1.03819 1.7604 1.03819 1.81258V10.873C1.03819 10.9252 1.06755 10.9548 1.11938 10.9548H10.1193C10.1711 10.9548 10.2005 10.9252 10.2005 10.873V7.24886C10.2005 6.97061 10.4423 6.72714 10.7187 6.72714C10.9951 6.72714 11.2387 6.97061 11.2387 7.24886Z" fill="black" />
                            <path d="M11.237 1.20739V4.52898C11.237 4.80723 10.9952 5.05069 10.7188 5.05069C10.4424 5.05069 10.2006 4.80723 10.2006 4.52898V2.46472L6.29832 6.39151C6.20503 6.48541 6.07893 6.53411 5.92001 6.53411C5.76108 6.53411 5.63498 6.48715 5.5417 6.39324C5.44151 6.29238 5.38623 6.16195 5.38623 6.0263C5.38623 5.89066 5.44151 5.76023 5.5417 5.65936L9.47334 1.73084H7.41942C7.14303 1.73084 6.90119 1.48737 6.90119 1.20739C6.90119 0.929136 7.14303 0.685669 7.41942 0.685669H10.7188C10.9952 0.685669 11.237 0.929136 11.237 1.20739Z" fill="black" />
                        </svg>
                    </span>
                </p>

                <p className="w-full flex flex-col md:flex-row md:items-center justify-between mt-[24px]">
                    <span className=" leading-[20px] text-[#A9A9A9]">Limit per Mint</span>
                    <span className=" leading-[20px] text-[#1E1E1E]">{parseData.lim}</span>
                </p>
                <p className="w-full flex flex-col md:flex-row md:items-center justify-between mt-[24px]">
                    <span className=" leading-[20px] text-[#A9A9A9]">Max Supply</span>
                    <span className=" leading-[20px] text-[#1E1E1E]">{parseData.maxSupply}</span>
                </p>
                <p className="w-full flex flex-col md:flex-row md:items-center justify-between mt-[24px]">
                    <span className=" leading-[20px] text-[#A9A9A9]">Minted</span>
                    <span className=" leading-[20px] text-[#1E1E1E]">{parseData.minted}</span>
                </p>
                <p className="w-full flex flex-col md:flex-row md:items-center justify-between mt-[24px]">
                    <span className=" leading-[20px] text-[#A9A9A9]">Decimals</span>
                    <span className=" leading-[20px] text-[#1E1E1E]">{detail.decimals}</span>
                </p>
                <div className="w-full flex flex-col md:flex-row md:items-start justify-between mt-[24px]">
                    <span className=" leading-[20px] text-[#A9A9A9]">Miners</span>
                    <div className="flex-1 md:ml-[50px] -mr-[12px] mt-[6px] md:mt-0 flex-wrap md:justify-end flex items-center leading-[20px] text-[#1E1E1E]">
                        {
                            miners?.map(miner => {
                                return <Miner key={miner.address} className="mb-[12px]" miner={miner} />
                            })
                        }
                    </div>
                </div>
                <p className="w-full flex flex-col md:flex-row md:items-center justify-between mt-[24px]">
                    <span className=" leading-[20px] text-[#A9A9A9]">Deploy By</span>
                    <span onClick={() => openLink(`https://bscscan.com/address/${detail.deploy_by}`)} className=" flex items-center leading-[20px] text-[#1E1E1E] cursor-pointer underline">
                        <span className="md:w-auto w-[275px] break-all">
                            {detail.deploy_by}
                        </span>
                        <svg className="ml-[8px] cursor-pointer" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.2387 7.24886V10.873C11.2387 11.4835 10.7256 12 10.1193 12H1.11938C0.513048 12 0 11.4835 0 10.873V1.81258C0 1.20217 0.513048 0.685669 1.11938 0.685669H4.71935C4.99574 0.685669 5.23931 0.929136 5.23931 1.20739C5.23931 1.48563 4.99747 1.73084 4.71935 1.73084H1.11938C1.06755 1.73084 1.03819 1.7604 1.03819 1.81258V10.873C1.03819 10.9252 1.06755 10.9548 1.11938 10.9548H10.1193C10.1711 10.9548 10.2005 10.9252 10.2005 10.873V7.24886C10.2005 6.97061 10.4423 6.72714 10.7187 6.72714C10.9951 6.72714 11.2387 6.97061 11.2387 7.24886Z" fill="black" />
                            <path d="M11.237 1.20739V4.52898C11.237 4.80723 10.9952 5.05069 10.7188 5.05069C10.4424 5.05069 10.2006 4.80723 10.2006 4.52898V2.46472L6.29832 6.39151C6.20503 6.48541 6.07893 6.53411 5.92001 6.53411C5.76108 6.53411 5.63498 6.48715 5.5417 6.39324C5.44151 6.29238 5.38623 6.16195 5.38623 6.0263C5.38623 5.89066 5.44151 5.76023 5.5417 5.65936L9.47334 1.73084H7.41942C7.14303 1.73084 6.90119 1.48737 6.90119 1.20739C6.90119 0.929136 7.14303 0.685669 7.41942 0.685669H10.7188C10.9952 0.685669 11.237 0.929136 11.237 1.20739Z" fill="black" />
                        </svg>
                    </span>
                </p>
                <p className="w-full flex flex-col md:flex-row md:items-center justify-between mt-[24px]">
                    <span className=" leading-[20px] text-[#A9A9A9]">Deploy Time</span>
                    <span className=" leading-[20px] text-[#1E1E1E]">{detail.block_at ? moment(detail.block_at * 1000).format("YYYY-MM-DD HH:mm:ss") : '-'}</span>
                </p>
                <p className="w-full flex flex-col md:flex-row md:items-center justify-between mt-[24px]">
                    <span className=" leading-[20px] text-[#A9A9A9]">Holders</span>
                    <span className=" leading-[20px] text-[#1E1E1E]">{detail?.holders}</span>
                </p>
                {/* <p className="w-full flex flex-col md:flex-row md:items-center justify-between mt-[24px]">
                    <span className=" leading-[20px] text-[#A9A9A9]">Total Transactions</span>
                    <span className=" leading-[20px] text-[#1E1E1E]">{detail.transactions}</span>
                </p> */}
            </div>
        </div>
    </div>
}

export default ExplorerDetailHeader;