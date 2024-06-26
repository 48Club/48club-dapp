import axios from 'axios'
import {
  RequestAccountBalanceProps,
  RequestExplorerProps,
  RequestHoldersProps,
  RequestTransferProps,
  RequestWraporUnwrapProps,
} from './request.type'

export const pageSize = 20

const hostName = 'https://inscription.48.club'
// const hostName = 'http://23.154.136.127:8547'

const _host_name = import.meta.env.MODE === '' ? '/api' : hostName

export const requestTimeConfig = {
  pollingInterval: 3000,
  pollingErrorRetryCount: 3,
  pollingWhenHidden: false,
  debounceWait: 300,
  refreshOnWindowFocus: true,
  manual: true,
}

axios.interceptors.request.use((request) => {
  const data: any = request.data
  if (data) {
    if (data.page !== undefined) {
      data.page_size = pageSize
      data.page -= 1
    }
    if (typeof data === 'string') {
      try {
        request.data = JSON.parse(request.data)
      } catch (error) {
        console.log('[error]:', error)
      }
    } else {
      request.data = new URLSearchParams(request.data)
    }
  }
  return request
})

axios.interceptors.response.use((response) => {
  return response.data
})

const inscriptionsApi = {
  post<T, T2>(url: string, ...props: any) {
    return axios.post<T, T2>(`${_host_name}${url}`, ...props)
  },
  getInscriptionsList(param: {
    page?: number
    protocol?: string
    status?: number
    // deployer?: string,
    tick_hash?: string
    // tick?:string,
  }) {
    const pararms: any = {
      ...param,
      page_size: pageSize,
    }
    if (param.tick_hash === '') {
      if (param.status !== undefined) {
        pararms.status = param.status
      }

      if (param.page !== undefined) {
        pararms.page = param.page
      }
    } else {
      pararms.tick_hash = param.tick_hash
    }

    return this.post<any, RequestExplorerProps>(`/bnb48_index/v1/inscription/list`, param)
  },
  getInscriptionsDetail(param: { tick_hash?: string; page: number }) {
    return this.post<any, RequestExplorerProps>(`/bnb48_index/v1/inscription/list`, param)
  },
  getInscriptionsHoldersList(param: { tick_hash: string; page: number }) {
    return this.post<any, RequestHoldersProps>(`/bnb48_index/v1/balance/list`, param)
  },
  getInscriptionsTransfersList(param: { tick_hash: string; page: number }) {
    return this.post<any, RequestTransferProps>(`/bnb48_index/v1/record/list`, param)
  },
  getUserBalances(param: { address: string; tick_hash?: string[] }) {
    return this.post<any, RequestAccountBalanceProps>(`/bnb48_index/v1/account/balance`, param)
  },
  getwrap_unwrapList(param: { type: number }) {
    return this.post<any, RequestWraporUnwrapProps>('/bnb48_index/v1/wrap_unwrap/list', param)
  },
  wrap_unwrapdelete(param: { ids: any[]; hash: string }) {
    return this.post<any, any>('/bnb48_index/v1/wrap_unwrap/delete', JSON.stringify(param))
  },
}

export default inscriptionsApi
