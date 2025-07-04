import axios from 'axios';
import Cookies from 'js-cookie';

// 根据环境设置 baseURL
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    // 生产环境
    return 'https://www.48.club';
  }
  // 开发环境
  return '/';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 可选：超时时间
})

axios.defaults.withCredentials = true
// 请求拦截器
api.interceptors.request.use(config => {
  if (config.url &&
    config.url.startsWith('/v4') &&
    !config.url.startsWith('/v4/login') // 排除 /v4/login
    && config.url !== '/login' // 排除 /login
  ) {
    const token = Cookies.get('token')
    if (token) {
      config.headers['x-token'] = token
    }
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器（可选，根据需要添加）
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 清除 token
      Cookies.remove('token')
      // 跳转到登录页（假设你的登录页是 /login）
      window.location.href = '/login'
    }
    // 这里可以做全局错误处理
    return Promise.reject(error)
  }
)

export const login = async (data: any) => {
  return api.post('/v4/login', data)
}

export const stat = async (data: any) => {
  return api.get('/v4/stat', { params: data, method: 'GET' })
}
export const getVoteList = async (id: string) => {
  return api.get(`/api/v2/vote/list/${id}`)
}
export const vote = async (id: string, params: any) => {
  return api.post(`/api/v2/vote/${id}`, params)
}
export const getUserVote = async (id: string, account: string) => {
  return api.get(`/api/v2/vote/user/${id}?address=${account}`)
}
export const getTradeRace = async (params: any) => {
  return api.get(`https://api.trade-race.48.club`, { params, method: 'GET' })
}
export const getTradeRaceAirdrop = async (params: any) => {
  return api.get(`https://api.trade-race.48.club/airdrop`, { params, method: 'GET' })
}
export default api