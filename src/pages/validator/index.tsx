import React, { useState, useCallback, useEffect } from 'react'
import { DatePicker, Table, Input } from 'antd'
import moment from "moment"
import fetch from 'node-fetch';


export default function NFT() {
    const queryData = async (dateString) => {
        return await fetch('https://www.48.club/api/v1/query?date=' + dateString).then(async (response) => {
            return Object.values(await response.json()).filter((item) => {
                // 过滤 rewardFromPuissant 为 0 的数据
                return item.rewardFromPuissant !== 0
            })
        })
    }

    const [dataSource, setDataSource] = useState([])

    const reloadDataSource = useCallback(async (dateString) => {
        setDataSource([])
        setDataSource(await queryData(dateString));
    }, [dataSource])

    useEffect(() => {
        reloadDataSource(moment().format('YYYY-MM-DD'))
    }, [])


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
                                    {/* 限制选择的日期只能是最近一周的日期 */ }
                                    return current && current > moment().endOf('day') || current < moment().subtract(7, 'days')
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
                    <Table dataSource={dataSource} rowKey="miner">
                        <Table.Column className="w-auto" title="Validator" dataIndex="miner" key="miner" />
                        <Table.Column className="w-auto" title="Reward" dataIndex="reward" key="reward" />
                        <Table.Column className="w-auto" title="RewardFromPuissant" dataIndex="rewardFromPuissant" key="rewardFromPuissant" />
                        <Table.Column className="w-auto" title="BlockCount" dataIndex="blockCount" key="blockCount" />
                    </Table>
                </div>
            </div>

        </div>
    )
}
