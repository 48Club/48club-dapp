import { useEffect } from 'react'
import ExplorerHeader from '../explorer/ExplorerHeader'
import {
  AccountBalanceLocalDataProps,
  SearchResultList,
  useInscriptionsLocalHashList,
  useInscriptionsSearchState,
} from '@/store'
import AccountBody from './AccountBody'
import inscriptionsApi from '@/utils/request'
import { AccountToken, AccountTokenProps } from '@/constants/inscriptions'
import { decimalsToStr } from '@/utils'
import { useEthers } from '@usedapp/core'
import useUrlState from '@ahooksjs/use-url-state'

const Account = () => {
  const { searchText, setSearchText, searchTextHash, setResult, setLoading } = useInscriptionsSearchState()

  const { localHashList } = useInscriptionsLocalHashList()

  const [urlState, setUrlState] = useUrlState({ address: '' })

  const { account } = useEthers()

  const search = async (text: string = searchText) => {
    setLoading(true)
    // const tickHashList = AccountToken.map(hash => hash.tick_hash);
    // const localTickHash = localHashList.map(hash => hash.tick_hash);
    // const hashList = Array.from(new Set([...tickHashList, ...localTickHash]));
    setUrlState({ address: text })
    inscriptionsApi
      .getUserBalances(
        searchTextHash
          ? {
              address: text,
              tick_hash: [searchTextHash],
            }
          : { address: (text || 'undefined') as string }
      )
      .then((res) => {
        setLoading(false)
        if (res.code === 0) {
          const walletList = res.data.wallet.map((item) => {
            return {
              ...item,
              amount: decimalsToStr(item.balance, item?.decimals),
            }
          })
          console.log('eset', walletList)
          setResult(walletList)
        }
      })
      .then(() => setLoading(false))
  }

  // const { run, cancel } = useRequest(search, {
  //     pollingInterval: timeRequest,
  // });

  useEffect(() => {
    if (urlState.address && searchText === '') {
      setSearchText(urlState.address)
      search(urlState.address)
    }
  }, [])

  useEffect(() => {
    if (searchText === '') {
      if (account?.startsWith('0x') && searchText === '') {
        setSearchText(account)
        search(account)
      }
    }
  }, [account])

  return (
    <div className="mt-[32px]">
      <ExplorerHeader onSearch={search} />
      <AccountBody onSearch={search} />
    </div>
  )
}

export default Account
