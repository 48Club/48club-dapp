import { AccountToken } from "@/constants/inscriptions";
import { SearchResultList, useInscriptionsBetchTransferState, useInscriptionsLocalHashList, useInscriptionsSearchState } from "@/store";
import inscriptionsApi from "@/utils/request";
import { ExplorerDataProps } from "@/utils/request.type";
import { shorten } from "@funcblock/dapp-sdk";
import { AutoComplete, Button, Input, Radio, Spin, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const Row: React.FC<{
    data: SearchResultList;
    click: () => void;
    active: boolean;
}> = ({ data, click, active }) => {

    const nav = useNavigate()

    const {
        localHashList,
        setLocalHashList
    } = useInscriptionsLocalHashList()

    const { betchTransferState } = useInscriptionsBetchTransferState()

    const del = () => {
        if (betchTransferState.tick_hash !== data.tick_hash) {
            const delIndex = localHashList.findIndex(i => i.tick_hash === data.tick_hash);
            const newLocalList = [...localHashList];
            newLocalList.splice(delIndex, 1);
            setLocalHashList(newLocalList);
        } else {
            message.error("You cannot delete an already selected")
        }
    }

    const ItemNode = (<>
        <div className="flex-1 md:hidden text-[12px] text-[#E2B201] font-[400] leading-[24px]">
            {data.tick}  <span className="ml-[8px] px-[6px] h-[17px] leading-[17px] font-[400] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">BNB-48</span>
            <div className="text-[10px]">({shorten(data.tick_hash)})</div>
        </div>
        <div className="flex-1 md:flex hidden text-[14px] text-[#E2B201] items-center font-[400] leading-[24px]">
            {data.tick} <span className="text-[12px]">({shorten(data.tick_hash)})</span> <span className="ml-[8px] px-[6px] h-[17px] leading-[17px] font-[400] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">BNB-48</span>
        </div>
        {/* <div className="flex justify-center">
            {data.decimals || '-'}
        </div> */}
        <div className="flex justify-end">
            {data.amount || '-'}
        </div>
        {/* <div className="flex-1 flex justify-end">
            {
                data.type === 'local' && <Button onClick={del} type="primary" danger className="w-[98px]">Delete</Button>
            }
        </div> */}
    </>)

    return (
        <>
            <div onClick={click} style={active ? { borderColor: '#FFC801', background: '#F9F9F9' } : undefined} className="cursor-pointer md:flex hidden px-[10px] md:px-[20px] border transition-all border-transparent rounded-[4px] hover:bg-[#f4f4f4] h-[56px] flex-row justify-between items-center text-[14px] md:text-[16px]">
                {ItemNode}
            </div>
            <div onClick={() => {
                click();
                nav("/inscriptions/account/mobile/betch")
            }} className="cursor-pointer md:hidden px-[10px] md:px-[20px] border transition-all border-transparent rounded-[4px] active:bg-[#f4f4f4] h-[56px] flex flex-row justify-between items-center text-[14px] md:text-[16px]">
                {ItemNode}
            </div>
        </>
    )
}

const SearchRow:React.FC<{
    data: ExplorerDataProps
}> = ({ data }) => {
    const {
        localHashList,
        setLocalHashList
    } = useInscriptionsLocalHashList()

    const checkHasImport = (h: string) => {
        return localHashList.findIndex(hash => hash.tick_hash === h) !== -1 || AccountToken.findIndex(token => token.tick_hash === data.tick_hash) !== -1;
    }

    const importHash = (tick: ExplorerDataProps) => {
        setLocalHashList([...localHashList, { ...tick, protocol: "bnb-48", type: "local", balance: 0 }])
    }

    return <div onClick={(e) => e.stopPropagation()} className="h-[51px] flex px-[12px] items-center cursor-default">
        <div className="flex-1 text-[#E2B201] font-[400] leading-[24px]">
            {data.tick} <span className="ml-[8px] px-[6px] py-[4px] bg-[rgba(217,217,217,.4)] text-[10px] rounded-full text-[#1E1E1E]">BNB-48</span>
        </div>
        {
            checkHasImport(data.tick_hash) ?
                <Button onClick={(e) => {
                    e.stopPropagation()
                }} className="w-[98px] outline-none h-[28px] cursor-default bg-[#E9E9E9] text-[#1E1E1E]">Imported</Button>
                :
                <Button onClick={(e) => {
                    e.stopPropagation();
                    importHash(data)
                }} className="w-[98px] h-[28px]" type="primary">Import</Button>
        }
    </div>
}

const SelectedToken = ({ onSearch }: any) => {

    const { setSelectedToken, betchTransferState } = useInscriptionsBetchTransferState()

    const { result, loading, setSearchTextHash, searchTextHash } = useInscriptionsSearchState()

    const [tabType, setTabType] = useState("bnb-48");

    // const [searchText, setSearchText] = useState('')

    const { t } = useTranslation()

    const resultList = useMemo(() => {
        return result //.filter(res => res.protocol === tabType)
    }, [tabType, result])

    useEffect(() => {
        if (betchTransferState?.tick_hash === undefined && resultList.length > 0) {
            setSelectedToken(resultList[0])
        }
    }, [resultList])

    // const [options, setOptions] = useState<{ value: string; label: JSX.Element }[]>([]);

    // const handleSearch = async (value: string) => {
    //     inscriptionsApi.getInscriptionsList({ page: 1, protocol: tabType, status: 0, tick_hash: value }).then((res) => {
    //         if (res.code === 0) {
    //             const resNode = res.data.list.map((item) => {
    //                 return {
    //                     value: item.tick_hash,
    //                     label: <SearchRow data={item} />
    //                 }
    //             })
    //             setOptions(resNode);
    //         }

    //     })
    // };

    return <div className="w-full shadow pt-[32px] pb-[32px] min-h-[600px] px-[12px]">
        <div className="diy-scrollbar px-[10px]">
            <Radio.Group className="h-[50px]" value={tabType} onChange={(val) => setTabType(val.target.value)}>
                <Radio.Button value="bnb-48" style={{ background: tabType === 'bnb-48' ? '#fff' : '#E9E9E9' }} className=" leading-[40px] flex-1 h-[40px] text-center no-border">BNB-48</Radio.Button>
            </Radio.Group>
        </div>
        {/* <AutoComplete
            popupClassName="token-seleted-list"
            className="w-full h-[48px_!important] mt-[32px] mb-[40px]"
            options={options}
            onSearch={handleSearch}
            size="large"
        > */}
            <Input
                placeholder="Enter"
                className=" w-full rounded-[4px] mt-[32px] mb-[40px] h-full no-border bg-[#F9F9F9]"
                onChange={(val) => {
                    setSearchTextHash(val.target.value)
                }}
                value={searchTextHash}
                allowClear={{
                    clearIcon: <svg className=" translate-y-[4px]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="11" fill="black" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.685547 11.9998C0.685547 5.76466 5.76215 0.685547 11.9998 0.685547C18.2375 0.685547 23.3141 5.76717 23.3141 12.0023C23.3141 18.2375 18.2375 23.3166 11.9998 23.3166C5.76215 23.3166 0.685547 18.235 0.685547 11.9998ZM8.13711 15.6992C8.30298 15.8651 8.52414 15.9204 8.7453 15.9204C8.96646 15.9204 9.18761 15.8651 9.35348 15.6992L11.9999 13.0503L14.6487 15.6992C14.8146 15.8651 15.0358 15.9204 15.2569 15.9204C15.4781 15.9204 15.6992 15.8651 15.8651 15.6992C16.1968 15.3675 16.1968 14.8724 15.8651 14.5407L13.1031 11.9471L15.752 9.29819C16.0837 8.96645 16.0837 8.41355 15.752 8.08181C15.4203 7.75007 14.9252 7.75007 14.5934 8.08181L11.9446 10.7307L9.29568 8.08181C8.96394 7.75007 8.46885 7.75007 8.13711 8.08181C7.80537 8.41355 7.80537 8.90864 8.13711 9.24038L10.786 11.8893L8.13711 14.5407C7.80537 14.8724 7.80537 15.3675 8.13711 15.6992Z" fill="#E9E9E9" />
                    </svg>
                }}
                suffix={
                    searchTextHash.length > 0
                        ?
                        <svg onClick={() => onSearch()} className=" cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M23.0271 21.6144L23.0306 21.6213C23.3407 21.9968 23.3717 22.6342 23.0961 23.0477L23.0857 23.0615L23.0754 23.0718C22.8962 23.2544 22.6516 23.344 22.3449 23.344C22.0417 23.344 21.7937 23.251 21.6145 23.0718L16.7874 18.2482C14.9372 19.6987 12.7804 20.4636 10.534 20.4636C9.21092 20.4636 7.92232 20.2018 6.70608 19.6815C5.53119 19.1819 4.47688 18.4653 3.56384 17.5557C2.65424 16.6461 1.93759 15.5883 1.438 14.4134C0.921183 13.1972 0.655884 11.9086 0.655884 10.5855C0.655884 9.26248 0.917737 7.97044 1.438 6.7473C1.93759 5.56552 2.65424 4.50432 3.56384 3.58783C4.47343 2.67135 5.53119 1.9478 6.70264 1.44477C7.92232 0.921061 9.21092 0.655762 10.534 0.655762C11.857 0.655762 13.1456 0.917615 14.3653 1.43788C15.5402 1.93747 16.5945 2.65412 17.5075 3.56372C18.4206 4.47331 19.1338 5.53106 19.6334 6.70596C20.1502 7.9222 20.4155 9.2108 20.4155 10.5338C20.4155 12.8699 19.6299 15.0818 18.2035 16.7908L23.0271 21.6144ZM2.66458 10.5855C2.66458 14.9233 6.19271 18.4549 10.534 18.4549C14.8718 18.4549 18.4034 14.9268 18.4034 10.5855C18.4034 6.24425 14.8718 2.71612 10.534 2.71612C6.19616 2.71612 2.66458 6.2477 2.66458 10.5855Z" fill="#FFC801" />
                        </svg>
                        :
                        <svg onClick={() => onSearch()} className=" cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M23.027 21.6144L23.0305 21.6213C23.3406 21.9968 23.3716 22.6342 23.0959 23.0477L23.0856 23.0615L23.0753 23.0718C22.8961 23.2544 22.6515 23.344 22.3448 23.344C22.0416 23.344 21.7936 23.251 21.6144 23.0718L16.7873 18.2482C14.9371 19.6987 12.7803 20.4636 10.5338 20.4636C9.2108 20.4636 7.9222 20.2018 6.70596 19.6815C5.53106 19.1819 4.47676 18.4653 3.56371 17.5557C2.65412 16.6461 1.93747 15.5883 1.43788 14.4134C0.921061 13.1972 0.655762 11.9086 0.655762 10.5855C0.655762 9.26248 0.917615 7.97044 1.43788 6.7473C1.93747 5.56552 2.65412 4.50432 3.56371 3.58783C4.47331 2.67135 5.53106 1.9478 6.70251 1.44477C7.9222 0.921061 9.2108 0.655762 10.5338 0.655762C11.8569 0.655762 13.1455 0.917615 14.3652 1.43788C15.5401 1.93747 16.5944 2.65412 17.5074 3.56372C18.4205 4.47331 19.1337 5.53106 19.6333 6.70596C20.1501 7.9222 20.4154 9.2108 20.4154 10.5338C20.4154 12.8699 19.6298 15.0818 18.2034 16.7908L23.027 21.6144ZM2.66446 10.5855C2.66446 14.9233 6.19259 18.4549 10.5338 18.4549C14.8717 18.4549 18.4032 14.9268 18.4032 10.5855C18.4032 6.24425 14.8717 2.71612 10.5338 2.71612C6.19604 2.71612 2.66446 6.2477 2.66446 10.5855Z" fill="black" />
                        </svg>
                }
            />
        {/* </AutoComplete> */}

        <div className="flex flex-row justify-between px-[12px] md:px-[20px] items-center leading-[24px] mb-[16px] text-[16px] font-[400]">
            <div className="flex-1 text-gray">Token</div>
            <div className="flex-1 text-gray justify-end flex">Balance</div>
            {/* <div className="flex-1 flex text-gray justify-end"></div> */}
        </div>
        <Spin spinning={loading} size="large">
            {
                resultList.length > 0 ?
                    resultList.map((i) => {
                        return <Row active={betchTransferState.tick_hash === i.tick_hash} click={() => setSelectedToken(i)} key={i.tick_hash} data={i} />
                    })
                    :
                    <div className="flex flex-col items-center justify-center py-16">
                        <img src="/static/staking-no-records.png" className="mb-6" alt="" />
                        <span className="text-base text-gray">{t('no_records')}</span>
                    </div>

            }
        </Spin>
    </div>
}

export default SelectedToken;