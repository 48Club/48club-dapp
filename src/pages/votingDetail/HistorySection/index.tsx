import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'
import { useEthers } from '@usedapp/core'
import { useParams } from 'react-router-dom'
import { formatAmount } from '@funcblock/dapp-sdk'
import useGovDetailVotes from '../../../hooks/gov/useGovDetailVotes'
import { useEffect, useState } from 'react'
import { getVoteList, vote, getUserVote } from '@/utils/axios'
import { message, Tooltip } from 'antd'
import { DislikeOutlined, LikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons'
import useSignMessage from '@/hooks/useSignMessage'


export default function HistorySection() {
  const { t } = useTranslation()
  const { account } = useEthers()
  const [userVote, setUserVote] = useState<any>({})
  const [voteList, setVoteList] = useState<any>([])
  const { id } = useParams<{ id: string }>()
  const { voteRecords } = useGovDetailVotes(id as string)
  const { signMessage } = useSignMessage()
  const [messageApi, contextHolder] = message.useMessage();
  const fetchUserVote =  async ()=> {
    if (account) {
      const res = await getUserVote(id as string, account)
      if (res.status === 200 && res.data.code === 200) {
        setUserVote(res.data.data)
      }
    }
  }
  const handleDislike = async (tx_hash: string) => {
    if (userVote[tx_hash]) {
      return
    }
    try {
      const signature = await signMessage(`${id}:{"msg":"dis","tx_hash":"${tx_hash}"}`)
      const res = await vote(id as string, {
        sign: signature,
      msg: 'dis',
      tx_hash: tx_hash,
      address: account,
    })
    if (res.status === 200 && res.data.code !== 200) {
      messageApi.open({
        type: 'error',
        content: res.data.msg,
      });
      } else {
        fetchUserVote()
      }
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error?.message || 'Operation failed'
      });
    }
    
  }

  const handleLike = async (tx_hash: string) => {
    if (userVote[tx_hash]) {
      return
    }
    try {
      const signature = await signMessage(`${id}:{"msg":"agree","tx_hash":"${tx_hash}"}`)
      const res = await vote(id as string, {
        sign: signature,
        msg: 'agree',
        tx_hash: tx_hash,
        address: account,
      })
      if (res.status === 200 && res.data.code !== 200) {
        messageApi.open({
          type: 'error',
          content: res.data.msg,
        });
      } else {
        fetchUserVote()
      }
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error?.message || 'Operation failed'
      });
    }
  }

  useEffect(() => {
    async function getdata() {
      const res = await getVoteList(id as string)
      if (res.status === 200 && res.data.code === 200) {
        setVoteList(res.data.data)
      }
    }
    getdata()
  }, [])
  useEffect(() => {
    fetchUserVote()
  }, [account])

  if (!voteRecords) {
    return null
  }

  return (
    <div className="flex flex-col my-20">
      <Label text={t('vote_details')} />
      {contextHolder}
      <div className="mt-6 px-6 shadow rounded-lg">
        {voteRecords.length > 0 ? (
          <div>
            <div
              className="hidden md:grid justify-between pt-10 pb-4 text-gray"
              style={{ gridTemplateColumns: '40% 10% 30% 10% 10% ' }}
            >
              <span className="flex">{t('address')}</span>
              <span>{t('result')}</span>
              <span>{t('reason')}</span>
              <span>KOGE</span>
              <span>{t('block_number')}</span>
            </div>
            {voteRecords.map((i, index) => {
              return (
                <div key={index}>
                  <div className="pt-6 pb-2 flex flex-col border-b border-gray md:hidden" key={index + 'sm'}>
                    <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                      <span className="text-gray">{t('address')}</span>
                      <span className="break-words text-right text-light-black break-all">{i.voter}</span>
                    </div>
                    <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                      <span className="text-gray">{t('result')}</span>
                      <span className="break-words text-right">{i.support === '1' ? 'Approve' : 'Reject'}</span>
                    </div>
                    <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                      <span className="text-gray">{t('reason')}</span>
                      <div className="flex flex-row">
                        <span className="break-words text-right">{i.reason}</span>
                        {i.reason && (
                          <div className="flex flex-row">
                            <Tooltip title={voteList[i.transactionHash]?.agree}>
                              <div className="text-green-500 cursor-pointer mx-[5px]" onClick={() => handleLike(i.transactionHash)}>
                                {userVote[i.transactionHash]?.agree ? (
                                  <LikeFilled style={{ fontSize: 16, color: '#000' }} />
                                ) : (
                                  <LikeOutlined style={{ fontSize: 16, color: userVote[i.transactionHash]? '#808080' : '#000' }} />
                                )}
                              </div>
                            </Tooltip>
                            <Tooltip title={voteList[i.transactionHash]?.dis}>
                              <div className="text-red-500 cursor-pointer" onClick={() => handleDislike(i.transactionHash)}>
                                {userVote[i.transactionHash]?.dis ? (
                                  <DislikeFilled style={{ fontSize: 16, color: '#000' }} />
                                ) : (
                                  <DislikeOutlined style={{ fontSize: 16, color: userVote[i.transactionHash]? '#808080' : '#000' }} />
                                )}
                              </div>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                      <span className="text-gray">KOGE</span>
                      <span className="break-words text-right">{formatAmount(i.weight, 18)}</span>
                    </div>
                    <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                      <span className="text-gray">{t('block_number')}</span>
                      <span className="break-words text-right">{i.blockNumber}</span>
                    </div>
                  </div>
                  <div
                    className="hidden md:grid border-b justify-between py-4"
                    style={{ gridTemplateColumns: '40% 10% 30% 10% 10% ' }}
                    key={index + 'md'}
                  >
                    <span className="break-words text-light-black">{i.voter}</span>
                    <span className="break-words">{i.support === '1' ? 'Approve' : 'Reject'}</span>
                    <span className="break-words flex">
                      {i.reason}
                      {i.reason && (
                        <div className="flex flex-row">
                          <Tooltip title={voteList[i.transactionHash]?.agree}>
                            <div className="text-green-500 cursor-pointer mx-[5px]" onClick={() => handleLike(i.transactionHash)}>
                              {userVote[i.transactionHash]?.agree ? (
                                <LikeFilled style={{ fontSize: 16, color: '#000' }} />
                              ) : (
                                <LikeOutlined style={{ fontSize: 16, color: userVote[i.transactionHash]? '#808080' : '#000' }} />
                              )}
                            </div>
                          </Tooltip>
                          <Tooltip title={voteList[i.transactionHash]?.dis}>
                            <div className="text-red-500 cursor-pointer" onClick={() => handleDislike(i.transactionHash)}>
                              {userVote[i.transactionHash]?.dis ? (
                                <DislikeFilled style={{ fontSize: 16, color: '#000' }} />
                              ) : (
                                <DislikeOutlined style={{ fontSize: 16, color: userVote[i.transactionHash]? '#808080' : '#000' }} />
                              )}
                            </div>
                          </Tooltip>
                        </div>
                      )}
                    </span>
                    <span className="break-words">{formatAmount(i.weight, 18)}</span>
                    <span className="break-words">{i.blockNumber}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img src="/static/staking-no-records.png" className="mb-6 w-60" alt="" />
            <span className="text-base text-gray">{t('no_data')}</span>
          </div>
        )}
      </div>
    </div>
  )
}

