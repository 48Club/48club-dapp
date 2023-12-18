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

import oldIcon from '@/assets/images/old.png'

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

const effectData = {
    icon: oldIcon,
    lv: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1937_1568)">
            <path d="M5.65876 12.1758C5.55669 12.249 5.43966 12.2986 5.31611 12.3211C5.19255 12.3436 5.06554 12.3384 4.94424 12.3059C4.82293 12.2734 4.71034 12.2144 4.61459 12.1331C4.51883 12.0518 4.44229 11.9504 4.39048 11.836C4.26594 11.5611 4.05843 11.3322 3.7971 11.1813C3.53576 11.0304 3.23373 10.9652 2.93344 10.9949C2.80848 11.0072 2.68234 10.9916 2.56412 10.9493C2.4459 10.9069 2.33854 10.8389 2.24976 10.7501C2.16099 10.6613 2.09301 10.554 2.05073 10.4357C2.00844 10.3175 1.99291 10.1914 2.00524 10.0664C2.03483 9.76607 1.96959 9.46402 1.81868 9.20269C1.66777 8.94135 1.43878 8.73385 1.16388 8.60936C1.04948 8.55755 0.947992 8.48101 0.866736 8.38525C0.785479 8.28949 0.726474 8.17691 0.693971 8.0556C0.661468 7.93429 0.656277 7.80729 0.678772 7.68373C0.701267 7.56018 0.750887 7.44315 0.824058 7.34108C0.999795 7.09583 1.0943 6.80169 1.0943 6.49998C1.0943 6.19827 0.999795 5.90413 0.824058 5.65888C0.750887 5.55681 0.701267 5.43978 0.678772 5.31623C0.656277 5.19267 0.661468 5.06567 0.693971 4.94436C0.726474 4.82305 0.785479 4.71046 0.866736 4.61471C0.947992 4.51895 1.04948 4.44241 1.16388 4.3906C1.43873 4.26606 1.66767 4.05855 1.81853 3.79722C1.96939 3.53588 2.03459 3.23386 2.00498 2.93356C1.99268 2.8086 2.00826 2.68247 2.05057 2.56425C2.09289 2.44603 2.16089 2.33866 2.2497 2.24989C2.3385 2.16111 2.44588 2.09313 2.56411 2.05085C2.68234 2.00857 2.80848 1.99303 2.93344 2.00536C3.23376 2.03495 3.53581 1.96971 3.79715 1.8188C4.05849 1.6679 4.26598 1.4389 4.39048 1.164C4.44229 1.0496 4.51883 0.948114 4.61459 0.866858C4.71034 0.785601 4.82293 0.726596 4.94424 0.694093C5.06554 0.66159 5.19255 0.656399 5.31611 0.678894C5.43966 0.701389 5.55669 0.751009 5.65876 0.82418C5.90401 0.999917 6.19814 1.09442 6.49986 1.09442C6.80157 1.09442 7.09571 0.999917 7.34096 0.82418C7.44303 0.751009 7.56005 0.701389 7.68361 0.678894C7.80716 0.656399 7.93417 0.66159 8.05548 0.694093C8.17679 0.726596 8.28937 0.785601 8.38513 0.866858C8.48089 0.948114 8.55743 1.0496 8.60924 1.164C8.73377 1.43886 8.94128 1.66779 9.20262 1.81865C9.46395 1.96951 9.76598 2.03471 10.0663 2.0051C10.1912 1.99281 10.3174 2.00838 10.4356 2.05069C10.5538 2.09301 10.6612 2.16102 10.75 2.24982C10.8387 2.33862 10.9067 2.446 10.949 2.56423C10.9913 2.68246 11.0068 2.8086 10.9945 2.93356C10.9649 3.23389 11.0301 3.53594 11.181 3.79727C11.3319 4.05861 11.5609 4.2661 11.8358 4.3906C11.9502 4.44241 12.0517 4.51895 12.133 4.61471C12.2142 4.71046 12.2732 4.82305 12.3057 4.94436C12.3382 5.06567 12.3434 5.19267 12.3209 5.31623C12.2984 5.43978 12.2488 5.55681 12.1757 5.65888C11.9999 5.90413 11.9054 6.19827 11.9054 6.49998C11.9054 6.80169 11.9999 7.09583 12.1757 7.34108C12.2488 7.44315 12.2984 7.56018 12.3209 7.68373C12.3434 7.80729 12.3382 7.93429 12.3057 8.0556C12.2732 8.17691 12.2142 8.28949 12.133 8.38525C12.0517 8.48101 11.9502 8.55755 11.8358 8.60936C11.561 8.7339 11.332 8.94141 11.1812 9.20274C11.0303 9.46408 10.9651 9.7661 10.9947 10.0664C11.007 10.1914 10.9915 10.3175 10.9491 10.4357C10.9068 10.5539 10.8388 10.6613 10.75 10.7501C10.6612 10.8388 10.5538 10.9068 10.4356 10.9491C10.3174 10.9914 10.1912 11.0069 10.0663 10.9946C9.76595 10.965 9.4639 11.0302 9.20256 11.1812C8.94123 11.3321 8.73373 11.5611 8.60924 11.836C8.55743 11.9504 8.48089 12.0518 8.38513 12.1331C8.28937 12.2144 8.17679 12.2734 8.05548 12.3059C7.93417 12.3384 7.80716 12.3436 7.68361 12.3211C7.56005 12.2986 7.44303 12.249 7.34096 12.1758C7.09571 12 6.80157 11.9055 6.49986 11.9055C6.19814 11.9055 5.90401 12 5.65876 12.1758Z" fill="url(#paint0_linear_1937_1568)" />
            <path d="M9.05814 4.7086C9.12881 4.63768 9.22404 4.59665 9.32412 4.59401C9.4242 4.59137 9.52146 4.62731 9.59577 4.6944C9.67008 4.76149 9.71574 4.85459 9.7233 4.95442C9.73086 5.05425 9.69974 5.15316 9.63638 5.23068L9.6096 5.26032L6.30032 8.5696C6.23207 8.63784 6.14095 8.67835 6.04456 8.68329C5.94818 8.68824 5.85338 8.65727 5.7785 8.59638L5.74886 8.5696L3.9104 6.7314C3.83939 6.66078 3.79827 6.56555 3.79555 6.46544C3.79284 6.36533 3.82874 6.26801 3.89582 6.19365C3.9629 6.11928 4.05601 6.07357 4.15587 6.06598C4.25573 6.0584 4.35468 6.08952 4.43222 6.1529L4.46186 6.17968L6.02446 7.74202L9.05814 4.70886V4.7086Z" fill="white" />
        </g>
        <defs>
            <linearGradient id="paint0_linear_1937_1568" x1="2.03098" y1="2.8437" x2="11.781" y2="10.1562" gradientUnits="userSpaceOnUse">
                <stop stop-color="#1DA9F8" />
                <stop offset="0.626678" stop-color="#93D8FF" />
                <stop offset="1" stop-color="#6FCBFF" />
            </linearGradient>
            <clipPath id="clip0_1937_1568">
                <rect width="13" height="13" fill="white" />
            </clipPath>
        </defs>
    </svg>
}

const Row: React.FC<{
    data: ExplorerDataProps;
    tabType: string
}> = ({ data, tabType }) => {

    const nav = useNavigate()

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


    return (
        <div onClick={() => nav(`/inscriptions/explorer/detail/${data.tick_hash}`)} className="cursor-pointer hover:bg-[#f4f4f4] py-4 flex flex-row justify-between items-center border-t border-gray text-[14px]">
            <div className="w-[200px] flex items-center text-[#E2B201] text-[16px] font-[400] leading-[20px]">
                <div className="w-[28px] h-[28px] rounded-full relative">
                    <img className="w-full h-full" src={effectData.icon} alt="" />
                    <div className="absolute bottom-0 w-[13px] h-[13px] right-0">
                        {effectData.lv}
                    </div>
                </div>
                <div className="ml-[6px]">
                    {data.tick} <span className="ml-[8px] px-[6px] h-[17px] leading-[17px] font-[400] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">{tabType}</span>
                    <div className="text-black opacity-70 text-[12px] font-[400] "><Typography.Paragraph className="m-[0_!important]" copyable={{ text: data.tick_hash }}>{shorten(data.tick_hash)}</Typography.Paragraph> </div>
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