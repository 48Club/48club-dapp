import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { DatePicker, Table, Input } from 'antd'
import moment from "moment"
import fetch from 'node-fetch';


export default function NFT() {
    type apiDataT = {
        miner: string,
        reward: number,
        rewardFromPuissant: number,
        blockCount: number,
    }

    const validatorsList = useMemo(() => {
        return {
            "0x72b61c6014342d914470ec7ac2975be345796c2b": "48Club",
            "0xa6f79b60359f141df90a0c745125b131caaffd12": "Avengers",
            "0xd1d6bf74282782b0b3eb1413c901d6ecf02e8e28": "Feynman",
            "0x0bac492386862ad3df4b666bc096b0505bb694da": "Claude Shannon",
            "0xb218c5d6af1f979ac42bc68d98a5a0d796c6ab01": "Turing",
            "0x4396e28197653d0c244d95f8c1e57da902a72b4e": "Alps",
            "0x9bb832254baf4e8b4cc26bd2b52b31389b56e98b": "Stake2me",
            "0xe2d3a739effcd3a99387d015e260eefac72ebea1": "MathWallet",
            "0x7ae2f5b9e386cd1b50a4550696d957cb4900f03a": "fuji",
        }
    }, [])


    const queryData = useCallback(async (dateString: string) => {
        var response = await fetch('https://www.48.club/api/v1/query?date=' + dateString)
        var data = Object.values(await response.json()) as apiDataT[]
        data = data.filter((item) => {
            return item.rewardFromPuissant !== 0 && validatorsList[item.miner] !== undefined
        })
        data.forEach((item) => {
            item.miner = validatorsList[item.miner]
        })
        return data
    }, [validatorsList])

    const [dataSource, setDataSource] = useState([] as apiDataT[])

    const reloadDataSource = useCallback(async (dateString) => {
        setDataSource([] as apiDataT[])
        setDataSource(await queryData(dateString));
    }, [queryData])

    useEffect(() => {
        reloadDataSource(moment().format('YYYY-MM-DD'))
    }, [reloadDataSource])


    return (
        <div className="px-4 max-w-6xl mx-auto">
            <div className="">
                <div className="mt-8 px-14 flex flex-row justify-between bg-another-white items-center min-h-[220px]">
                    <div>
                        <div className="text-4xl font-bold">Puissant</div>
                        <div className="my-4 text-base font-normal text-dark-gray flex flex-row">
                            <div className="mr-8">MEV solution on BNB Smart Chain</div>
                        </div>
                        <div className="w-40">
                            <DatePicker
                                defaultValue={moment()}
                                disabledDate={(current) => {
                                    return current > moment().endOf('day') || current < moment().subtract(7, 'days')
                                }}
                                className="w-full"
                                onChange={(date, dateString) => {
                                    reloadDataSource(dateString)
                                    console.log(dateString);
                                }}
                            />
                        </div>
                    </div>
                    <img src="/static/nft-header.png" className="w-80 mt-5" alt="" style={{ marginBottom: '-40px' }} />
                </div>
            </div>
            <div className="pb-20">
                <div className="mt-10 shrink-0 w-20 flex flex-col md:w-24" style={{ flexShrink: 0 }}>
                </div>
                <div className="mt-0 md:mt-16 flex flex-col md:flex-row md:flex-wrap w-full">
                    <Table dataSource={dataSource} rowKey="miner" className="w-full">
                        <Table.Column className="w-auto" title="Validator" dataIndex="miner" key="miner" />
                        <Table.Column className="w-auto" title="Reward" dataIndex="reward" key="reward" />
                        <Table.Column className="w-auto" title="RewardFromPuissant" dataIndex="rewardFromPuissant" key="rewardFromPuissant" />
                        <Table.Column className="w-auto" title="BlockCount" dataIndex="blockCount" key="blockCount" />
                    </Table>
                </div>
            </div>

        </div >
    )
}
