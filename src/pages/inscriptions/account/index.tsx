import { useEffect } from "react";
import ExplorerHeader from "../explorer/ExplorerHeader";
import { AccountBalanceLocalDataProps, SearchResultList, useInscriptionsLocalHashList, useInscriptionsSearchState } from "@/store";
import AccountBody from "./AccountBody";
import inscriptionsApi from "@/utils/request";
import { AccountToken, AccountTokenProps } from "@/constants/inscriptions";
import { decimalsToStr } from "@/utils";
import { useEthers } from "@usedapp/core";
import useUrlState from '@ahooksjs/use-url-state';

const Account = () => {

    const { searchText, setSearchText, setResult, setLoading } = useInscriptionsSearchState()

    const {
        localHashList
    } = useInscriptionsLocalHashList()

    const [urlState, setUrlState] = useUrlState({address: ''})

    const { account } = useEthers()

    const search = async (text:string=searchText) => {
        setLoading(true)
        const tickHashList = AccountToken.map(hash => hash.tick_hash);
        const localTickHash = localHashList.map(hash => hash.tick_hash);
        const hashList = Array.from(new Set([...tickHashList, ...localTickHash]));
        setUrlState({address: text})
        inscriptionsApi.getUserBalances({
            address: text,
            tick_hash: hashList
        }).then(res => {
            console.log('resresrse', res)
            setLoading(false)
            if (res.code === 0) {
                const resultList = hashList.map(tick_hash => {
                    let _basicItem: AccountBalanceLocalDataProps | AccountTokenProps | undefined = AccountToken.find(tick => tick.tick_hash === tick_hash)
                    if (_basicItem === undefined) {
                        _basicItem = localHashList.find(tick => tick.tick_hash === tick_hash)
                    }
                    const dataItem = res.data.wallet.find((i) => i.tick_hash === tick_hash)
                    let newItem: SearchResultList = {} as SearchResultList;
                    if(_basicItem) {
                        newItem = {
                            ..._basicItem,
                            balance: 0
                        }
                    }
                    if(dataItem) {
                        newItem = {
                            ...newItem,
                            ...dataItem,
                        }
                    }
                    if(newItem?.balance && newItem?.decimals !== undefined) {
                        newItem.amount = decimalsToStr(newItem.balance, newItem?.decimals)
                    }
                    return newItem
                })

                console.log('eset', resultList)
                setResult(resultList)
            }
        }).then(() => setLoading(false))
    }

    // const { run, cancel } = useRequest(search, {
    //     pollingInterval: timeRequest,
    // });

    useEffect(() => {
        if (searchText) {
            search()
        } else {
            const data = [...AccountToken, ...localHashList].map((hash) => {
                return {
                    ...hash,
                    balance: 0
                };
            })
            setResult(data)
        }
    }, [localHashList])

    useEffect(() => {
        if(urlState.address && searchText === '') {
            setSearchText(urlState.address)
            search(urlState.address)
        }
    }, [])

    useEffect(() => {
        if(searchText === '') {
            if(account?.startsWith('0x') && searchText === '') {
                setSearchText(account)
                search(account)
            }
        }
    }, [account])

    return <div className="mt-[32px]">
        <ExplorerHeader onSearch={search} />
        <AccountBody />
    </div>
}

export default Account;