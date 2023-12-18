import { Pagination, Radio, Spin, message } from "antd";
import { useEffect, useState } from "react";
import HoldersRow, { HoldersRowDataProps } from "./Rows/HoldersRow";
import TransfersRow, { TransfersRowDataProps } from "./Rows/TransfersRow";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import inscriptionsApi, { pageSize } from "@/utils/request";
import { decimalsToStr } from "@/utils";
import { ExplorerDataProps } from "@/utils/request.type";
// import { useRequest } from "ahooks";


const HistoryList: React.FC<{
    detail: ExplorerDataProps
}> = ({ detail }) => {

    const [tabType, setTabType] = useState("1");

    const [holdersRecords, setHoldersRecords] = useState<HoldersRowDataProps[]>([])
    const [transferRecords, setTransferRecords] = useState<TransfersRowDataProps[]>([])

    const { t } = useTranslation()

    const param = useParams()

    const [holdersPage, setHoldersPage] = useState(1)
    const [transferPage, setTransferPage] = useState(1)

    const [holdersTotal, setHoldersTotal] = useState(0)
    const [transferTotal, setTransferTotal] = useState(0)

    const [historyLoading, setHistoryLoading] = useState(false)

    const getHoldersList = (loading: boolean = true) => {
        loading && setHistoryLoading(true)
        inscriptionsApi.getInscriptionsHoldersList({
            tick_hash: param.id as string,
            page: holdersPage
        }).then(res => {
            setHistoryLoading(false)
            if (res.code === 0) {
                setHoldersTotal(res.data.count);
                const startRank = holdersPage === 1 ? 0 : ((holdersPage - 1) * pageSize);
                // console.log(res.data.list, 'res.data.list')
                const resData: HoldersRowDataProps[] = res.data.list.map((i, index: number) => {
                   const progress = +((decimalsToStr(i.balance, detail.decimals) / decimalsToStr(detail.minted, detail.decimals)) * 100).toFixed(2)
                    return {
                        ...i,
                        progress,
                        amount: decimalsToStr(+i.balance, detail.decimals),
                        rank: startRank + index + 1
                    }
                });
                setHoldersRecords(resData);
            } else {
                message.error({
                    content: "error"
                })
            }
        }).catch(() => setHistoryLoading(false))
    }

    // const { run } = useRequest(async (loading: boolean) => {
    //     if (tabType === "1") {
    //         getHoldersList(loading)
    //     } else {
    //         getTransferList(loading)
    //     }
    // }, requestTimeConfig);

    // useEffect(() => {
    //     if (param.id) {
    //         run(false)
    //     }
    // }, [param.id])

    useEffect(() => {
        if (param.id && tabType === "1" && detail.tick_hash) {
            getHoldersList()
        }
    }, [holdersPage, param.id, tabType, detail])

    const getTransferList = (loading: boolean = true) => {
        loading && setHistoryLoading(true)
        inscriptionsApi.getInscriptionsTransfersList({
            tick_hash: param.id as string,
            page: transferPage
        }).then(res => {
            setHistoryLoading(false)
            if (res.code === 0) {
                setTransferTotal(res.data.count);
                setTransferRecords(res.data.list.map((i) => ({
                    ...i,
                    amount: decimalsToStr(i.input_decode.amt, detail.decimals)
                })));
            }
            // console.log(res, 'transfer list')
        }).catch(() => setHistoryLoading(false))
    }

    useEffect(() => {
        if (param.id && tabType === "2") {
            getTransferList()
        }
    }, [transferPage, param.id, tabType])

    return <div className="mt-[64px] pb-[120px]">
        <div className="px-4 max-w-6xl mt-[32px] mx-auto shadow pt-[32px] pb-[40px]">
            <div className="w-[214px] mx-auto">
                <Radio.Group className="flex" value={tabType} onChange={(val) => setTabType(val.target.value)}>
                    <Radio.Button value="1" style={{ background: tabType === '1' ? '#fff' : '#E9E9E9' }} className=" leading-[40px] flex-1 h-[40px] text-center no-border">Holders</Radio.Button>
                    <Radio.Button value="2" style={{ background: tabType === '2' ? '#fff' : '#E9E9E9' }} className="mx-[16px] leading-[40px] flex-1 text-center h-[40px] no-border">Transfers</Radio.Button>
                </Radio.Group>
            </div>
            <Spin spinning={historyLoading} size="large">
                {
                    tabType === "1"
                        ?
                        <div key="holders">
                            <div className="w-full overflow-x-scroll diy-scrollbar">
                                <div className="max-w-[1200px] px-[24px] md:px-[65px] min-w-[700px] mt-[40px]">
                                    <div className="flex flex-row justify-between items-center mb-4">
                                        <div className="w-[140px] text-gray">Rank</div>
                                        <div className="w-[240px] text-gray">Address</div>
                                        <div className="w-[240px] text-gray">Percentage</div>
                                        <div className="w-[240px] text-gray">Value</div>
                                    </div>
                                    {
                                        (
                                            holdersRecords.length > 0 ? (
                                                <>
                                                    {holdersRecords.map((i) => <HoldersRow oneData={holdersRecords[0]} key={i.address} data={i} />)}

                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-16">
                                                    <img src="/static/staking-no-records.png" className="mb-6" alt="" />
                                                    <span className="text-base text-gray">{t('no_records')}</span>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                            <div className="justify-center flex mt-[32px]">
                                <Pagination onChange={setHoldersPage} pageSize={pageSize} showSizeChanger={false} className="table-pagination-btn" defaultCurrent={1} total={holdersTotal} />
                            </div>
                        </div>
                        :
                        <div key="transfer">
                            <div className="w-full overflow-x-scroll diy-scrollbar ">
                                <div className="max-w-[1200px] px-[24px] md:px-[65px] min-w-[900px] mt-[40px]">
                                    <div className="flex flex-row justify-between items-center mb-4">
                                        <div className="w-[240px] text-gray">Method</div>
                                        <div className="w-[240px] text-gray">Amount</div>
                                        <div className="w-[240px] text-gray">From</div>
                                        <div className="w-[240px] text-gray">To</div>
                                        <div className="w-[240px] text-gray flex justify-end">Date Time</div>
                                    </div>
                                    {
                                        (
                                            transferRecords.length > 0 ?
                                                transferRecords.map((i) => {
                                                    return <TransfersRow key={i.tx_hash} data={i} />
                                                })
                                                : (
                                                    <div className="flex flex-col items-center justify-center py-16">
                                                        <img src="/static/staking-no-records.png" className="mb-6" alt="" />
                                                        <span className="text-base text-gray">{t('no_records')}</span>
                                                    </div>
                                                )
                                        )
                                    }
                                </div>
                            </div>
                            <div className="justify-center flex mt-[32px]">
                                <Pagination onChange={setTransferPage} showSizeChanger={false} pageSize={pageSize} className="table-pagination-btn" defaultCurrent={1} total={transferTotal} />
                            </div>
                        </div>
                }
            </Spin>


        </div>
    </div>
}

export default HistoryList;