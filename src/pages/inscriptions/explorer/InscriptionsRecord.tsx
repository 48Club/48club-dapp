import Label from "@/components/Label";
import { Input, Pagination, Radio, Spin, Tabs, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Deploy } from "./Deploy";
import inscriptionsApi, { pageSize } from "@/utils/request";
import moment from "moment";
// import { useRequest } from "ahooks";
import { shorten } from "@funcblock/dapp-sdk";
import { ExplorerDataProps } from "@/utils/request.type";

import bnb48 from '@/assets/images/avatar.svg'
import { useInscriptionsEffectData } from "@/store";
import { getStaticUrl } from "@/App";

type TabTypeKey = "0" | "1" | "2";
type TabTypeItem = {
    key: TabTypeKey,
    label: string;
}

const tabTypeList: TabTypeItem[] = [
    {
        label: "All",
        key: '0',
    },
    // {
    //     label: "New",
    //     key: 'new',
    // },
    {
        label: "In-progress",
        key: '1',
    },
    {
        label: "Completed",
        key: '2',
    },
]

const Row: React.FC<{
    data: ExplorerDataProps;
    tabType: string
}> = ({ data, tabType }) => {

    const nav = useNavigate()

    const { effectData } = useInscriptionsEffectData()

    // const [openRecap, setOpenRecap] = useState(false)

    // const [form] = Form.useForm()

    // const _close = () => {
    //     setOpenRecap(false)
    //     form?.resetFields()
    // }

    // const ModalContent = (
    //     <div className="p-6 rounded-xl pb-[40px]">
    //         <div className="relative text-center text-[#1E1E1E] text-xl font-bold">
    //             Recap
    //             <img
    //                 src="/static/close.svg"
    //                 className="absolute top-0 right-0 transform -translate-y-1/2 cursor-pointer"
    //                 alt=""
    //                 onClick={_close}
    //             />
    //         </div>
    //         <div className="mt-[30px] md:mt-[50px]">
    //             <div className=" text-[#E2B201] text-[18px] font-[700] flex items-center leading-[20px]">
    //                 {data.tick} <div className="text-[14px] font-[400] ">({shorten(data.tick_hash)}) </div> <span className="ml-[8px] px-[6px]  h-[17px] leading-[17px] font-[400] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">{tabType}</span>
    //             </div>
    //             <div className="w-full mt-[20px] md:mt-[50px]">
    //                 {/* <p>{data.progress}%</p> */}
    //                 <div className="w-full h-[12px] overflow-hidden rounded-full bg-[rgba(255,200,1,.2)]">
    //                     <div style={{ width: `${data.progress}%` }} className="h-full rounded-full bg-[#FFC801]"></div>
    //                 </div>
    //             </div>
    //             <div className="flex justify-end mt-[10px]">
    //                 9000/210000000({data.progress}%)
    //             </div>
    //             <Form form={form} layout="vertical" size="large" preserve={false}>
    //                 <Form.Item name="totalSupply" required label="Total Supply">
    //                     <Input
    //                         type='number'
    //                         className="h-12 border-none rounded bg-light-white"
    //                         placeholder='21000000'
    //                     />
    //                 </Form.Item>
    //                 <Form.Item className="w-ful mt-[50px] mb-0 flex justify-center">
    //                     <Button size="large" className="md:w-[200px] w-[98px] text-[14px] h-12 bg-gray rounded no-border" onClick={_close}>
    //                         Cancel
    //                     </Button>
    //                     <Button size="large" className="md:w-[200px] w-[98px] ml-[20px]" type="primary" htmlType="submit">
    //                         Recap
    //                     </Button>
    //                 </Form.Item>
    //             </Form>
    //         </div>
    //     </div>
    // )

    const progress = ((data.minted / data.max) * 100).toFixed(2)


    const curentData = effectData.find(d => d.tick_hash === data.tick_hash);

    let effectDatasParam = {
        avatarIcon: bnb48,
        lvIcon: '',
        borderIcon: ""
    };
    if (curentData) {
        effectDatasParam = {
            borderIcon: getStaticUrl("border", curentData.border),
            lvIcon: getStaticUrl("lv", curentData.lv),
            avatarIcon: getStaticUrl("avatar", curentData.tick_hash)
        }
    }

    return (
        <div onClick={() => nav(`/inscriptions/explorer/detail/${data.tick_hash}`)} className="cursor-pointer hover:bg-[#f4f4f4] py-4 flex flex-row justify-between items-center border-t border-gray text-[14px]">
            <div className="w-[200px] flex items-center text-[#E2B201] text-[16px] font-[400] leading-[20px]">
                <div className="w-[28px] h-[28px] rounded-full relative">
                    <img className="w-full h-full" src={effectDatasParam.avatarIcon} alt="" />
                    {
                        effectDatasParam.borderIcon && <img className="w-[42px] translate-x-[-50%] translate-y-[-50%] h-[42px] absolute left-[50%] top-[50%]" src={effectDatasParam.borderIcon} alt="" />
                    }
                </div>
                <div className="ml-[6px]">
                    <div className="flex items-center">
                        <span className="font-[700]">{data.tick}</span>
                        {
                            effectDatasParam.lvIcon && <img className="w-[14px] h-[14px] mx-[2px]" src={effectDatasParam.lvIcon} alt="" />
                        }
                        <span className="ml-[8px] px-[6px] h-[17px] leading-[17px] font-[400] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">{tabType.toLocaleUpperCase()}</span>
                    </div>
                    <div className="text-[#A9A9A9] opacity-70 text-[12px] font-[400] "><Typography.Paragraph className="m-[0_!important] explorer-copy-color" copyable={{ text: data.tick_hash }}>{shorten(data.tick_hash)}</Typography.Paragraph> </div>
                </div>
            </div>
            <div className="w-[230px]">
                {data.block_at ? moment(data.block_at * 1000).format("YYYY-MM-DD HH:mm:ss") : "-"}
            </div>
            <div className="w-[240px]">
                <p>{progress}%</p>
                <div className="w-[104px] h-[8px] overflow-hidden rounded-full bg-[rgba(255,200,1,.2)]">
                    <div style={{ width: `${progress}%` }} className="h-full rounded-full bg-[#FFC801]"></div>
                </div>
            </div>
            <div className="w-[150px]">
                {data?.holders}
            </div>
            {/* <div className="w-[150px]">
                {}
            </div> */}
            {/* {
                myDeployed && <div onClick={e => e.stopPropagation()} className="w-[108px] flex justify-start">
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        setOpenRecap(true)
                    }} type="primary" className="w-[98px] h-[28px]">Recap</Button>
                    <div className="md:hidden block">
                        <Modal
                            open={openRecap}
                            onCancel={_close}
                            footer={false}
                            closeIcon={null}
                            width={668}
                            className="rounded-xl"
                            destroyOnClose
                            centered
                        >
                            {ModalContent}
                        </Modal>
                    </div>
                    <div className="md:hidden block">
                        <Modal
                            open={openRecap}
                            onCancel={_close}
                            footer={false}
                            closeIcon={null}
                            width="91.733vw"
                            className="rounded-xl"
                            destroyOnClose
                            centered
                        >
                            {ModalContent}
                        </Modal>
                    </div>
                </div>
            } */}


        </div>
    )
}

const Inscriptions = () => {

    const { t } = useTranslation()

    const [records, setRecord] = useState<ExplorerDataProps[]>([])

    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [tabType, setTabType] = useState("bnb-48");

    const [enterVal, setEnterVal] = useState('')

    // const { account } = useEthers()

    const [tableMenuKey, tableMenuKeyChange] = useState<TabTypeKey>('0')

    const [openDeploy, setOpenDeploy] = useState(false)

    // const [myDeployed, setMyDeployed] = useState(false)

    // const nav = useNavigate()

    const getInscriptionsData = async (loading: boolean) => {
        loading && setLoading(true)

        // const _searchText = {
        //     tick_hash: '',
        //     tick: '',
        //     deployer: '',
        // }
        // 如果选中my deployed
        // if (myDeployed) {
        //     _searchText.deployer = account as string;
        //     setEnterVal('');
        //     // 如果地址以0x开头,并且是66位,是tick_hash
        // } else if (enterVal.startsWith("0x") && enterVal.length === 66) {
        //     _searchText.tick_hash = enterVal;
        // } else {
        //     // 其他则是tick
        //     _searchText.tick = enterVal;
        // }
        const param = {
            tick_hash: '', status: +tableMenuKey, page, protocol: tabType
        }
        inscriptionsApi.getInscriptionsList(enterVal ? {
            tick_hash: enterVal
        } : param).then((res) => {
            setLoading(false)
            if (res.code === 0) {
                setTotal(res.data.count);
                setRecord(res.data.list);
            }
            // loading && (
            //     cancel(),
            //     run(false))
        }).catch(() => {
            setLoading(false)
        })
    }

    // const { run, cancel } = useRequest(getInscriptionsData, requestTimeConfig);

    useEffect(() => {
        setPage(1);
    }, [tableMenuKey, tabType])

    
    useEffect(() => {
        getInscriptionsData(true)
    }, [page, tableMenuKey, tabType])


    return <div className="w-full mt-[64px]">
        <div className="md:block hidden">
            <Deploy open={openDeploy} onClose={() => setOpenDeploy(false)} />
        </div>
        <div className="flex items-center justify-between">
            <Label text="Inscriptions"></Label>
            {/* <Button type="primary" onClick={() => setOpenDeploy(true)} className="w-[152px] md:block hidden text-[14px] font-[400] rounded-[4px] h-[40px] bg-yellow">Deploy</Button> */}
        </div>
        <div className="items-center justify-between md:hidden flex my-[32px]">
            {/* <Button type="primary" onClick={() => nav("/inscriptions/explorer/mobile/deploy")} className="w-[96px] text-[14px] font-[400] rounded-[4px] h-[40px] bg-yellow">Deploy</Button> */}
            <Input
                placeholder="Enter"
                className="w-[201px] h-[40px] bg-[#F9F9F9] no-border"
                onChange={(val) => {
                    setEnterVal(val.target.value)
                }}
                value={enterVal}
                suffix={
                    <svg onClick={() => getInscriptionsData(true)} className=" cursor-pointer" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M19.1891 18.012L19.192 18.0178C19.4504 18.3307 19.4762 18.8619 19.2465 19.2065L19.2379 19.2179L19.2293 19.2266C19.08 19.3787 18.8761 19.4534 18.6206 19.4534C18.3679 19.4534 18.1612 19.3759 18.0119 19.2266L13.9894 15.2069C12.4475 16.4156 10.6501 17.0531 8.77812 17.0531C7.67558 17.0531 6.60175 16.8348 5.58822 16.4013C4.60914 15.985 3.73055 15.3878 2.96968 14.6298C2.21168 13.8718 1.61447 12.9903 1.19815 12.0112C0.767469 10.9977 0.546387 9.92386 0.546387 8.82131C0.546387 7.71877 0.764598 6.64207 1.19815 5.62279C1.61447 4.63797 2.21168 3.75364 2.96968 2.9899C3.72768 2.22616 4.60914 1.62321 5.58535 1.20401C6.60175 0.767591 7.67558 0.546509 8.77812 0.546509C9.88066 0.546509 10.9545 0.76472 11.9709 1.19827C12.95 1.6146 13.8286 2.21181 14.5894 2.9698C15.3503 3.7278 15.9446 4.60926 16.361 5.58834C16.7916 6.60187 17.0127 7.6757 17.0127 8.77825C17.0127 10.7249 16.3581 12.5682 15.1694 13.9923L19.1891 18.012ZM2.2203 8.8213C2.2203 12.4361 5.16041 15.3791 8.77813 15.3791C12.393 15.3791 15.336 12.439 15.336 8.8213C15.336 5.20358 12.393 2.26347 8.77813 2.26347C5.16328 2.26347 2.2203 5.20645 2.2203 8.8213Z" fill="#A9A9A9" />
                    </svg>
                }
            />
        </div>
        <div className="shadow w-full mt-[36px]">
            <div className=" px-[24px] pt-[40px] md:px-[65px]">
                <div className="h-[40px] w-full flex items-center justify-between">
                    <div className="flex items-center w-[457px]">
                        <Radio.Group value={tabType} onChange={(val) => setTabType(val.target.value)}>
                            <Radio.Button value="bnb-48" style={{ background: tabType === 'bnb-48' ? '#fff' : '#E9E9E9' }} className=" leading-[40px] flex-1 h-[40px] text-center no-border">BNB-48</Radio.Button>
                        </Radio.Group>
                    </div>
                    <Input
                        placeholder="Enter"
                        className="w-[201px] md:flex hidden h-[40px] bg-[#F9F9F9] no-border"
                        onChange={(val) => {
                            setEnterVal(val.target.value)
                        }}
                        value={enterVal}
                        suffix={
                            <svg onClick={() => getInscriptionsData(true)} className=" cursor-pointer" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M19.1891 18.012L19.192 18.0178C19.4504 18.3307 19.4762 18.8619 19.2465 19.2065L19.2379 19.2179L19.2293 19.2266C19.08 19.3787 18.8761 19.4534 18.6206 19.4534C18.3679 19.4534 18.1612 19.3759 18.0119 19.2266L13.9894 15.2069C12.4475 16.4156 10.6501 17.0531 8.77812 17.0531C7.67558 17.0531 6.60175 16.8348 5.58822 16.4013C4.60914 15.985 3.73055 15.3878 2.96968 14.6298C2.21168 13.8718 1.61447 12.9903 1.19815 12.0112C0.767469 10.9977 0.546387 9.92386 0.546387 8.82131C0.546387 7.71877 0.764598 6.64207 1.19815 5.62279C1.61447 4.63797 2.21168 3.75364 2.96968 2.9899C3.72768 2.22616 4.60914 1.62321 5.58535 1.20401C6.60175 0.767591 7.67558 0.546509 8.77812 0.546509C9.88066 0.546509 10.9545 0.76472 11.9709 1.19827C12.95 1.6146 13.8286 2.21181 14.5894 2.9698C15.3503 3.7278 15.9446 4.60926 16.361 5.58834C16.7916 6.60187 17.0127 7.6757 17.0127 8.77825C17.0127 10.7249 16.3581 12.5682 15.1694 13.9923L19.1891 18.012ZM2.2203 8.8213C2.2203 12.4361 5.16041 15.3791 8.77813 15.3791C12.393 15.3791 15.336 12.439 15.336 8.8213C15.336 5.20358 12.393 2.26347 8.77813 2.26347C5.16328 2.26347 2.2203 5.20645 2.2203 8.8213Z" fill="#A9A9A9" />
                            </svg>
                        }
                    />
                </div>
                <div className="mt-[32px] flex items-center justify-between mb-[24px]">
                    <Tabs activeKey={tableMenuKey} onChange={(e) => tableMenuKeyChange(e as TabTypeKey)} items={tabTypeList} tabBarGutter={32} className="hide-tabs-bottom-line explorer-table-menu-type"></Tabs>
                    {/* <Checkbox checked={myDeployed} className="check-rouded-full hidden md:flex" onChange={(e) => setMyDeployed(e.target.checked)}>My Deployed</Checkbox> */}
                </div>
            </div>
            {/* <Checkbox checked={myDeployed} className="check-rouded-full ml-[24px] flex mb-[24px] md:hidden" onChange={(e) => setMyDeployed(e.target.checked)}>My Deployed</Checkbox> */}
            <Spin spinning={loading} size="large">
                <div className="w-full overflow-x-scroll diy-scrollbar">
                    <div className=" max-w-[1120px] min-w-[1100px] px-[24px] md:px-[65px] pb-[40px] rounded">
                        <div className="flex flex-row justify-between items-center mb-4">
                            <div className="w-[200px] text-gray">Token</div>
                            <div className="w-[230px] text-gray">Deploy Time</div>
                            <div className="w-[240px] text-gray">Progress</div>
                            <div className="w-[150px] text-gray">Holders</div>
                            {/* <div className="w-[150px] text-gray">Transactions</div> */}
                            {/* {
                                myDeployed && <div className="w-[108px]"></div>
                            } */}
                        </div>
                        {
                            (
                                records.length > 0 ? (
                                    <>
                                        {records.map((i) => {
                                            return <Row tabType={tabType} key={i.tick_hash} data={i} />
                                        })}
                                        <div key="pagination" className="justify-center md:flex hidden mt-[32px]">
                                            <Pagination pageSize={pageSize} showSizeChanger={false} className="table-pagination-btn" defaultCurrent={1} total={total} />
                                        </div>
                                    </>
                                ) : (
                                    <div key="empty" className="hidden :flex flex-col items-center justify-center py-16">
                                        <img src="/static/staking-no-records.png" className="mb-6" alt="" />
                                        <span className="text-base text-gray">{t('no_records')}</span>
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
            </Spin>
            <div className="justify-center md:hidden flex mt-[32px] pb-[40px]">
                <Pagination showSizeChanger={false} pageSize={pageSize} onChange={setPage} className="table-pagination-btn" defaultCurrent={1} total={total} />
            </div>
        </div>
    </div>
}

export default Inscriptions;