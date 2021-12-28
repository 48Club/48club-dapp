import { ChainId } from '@usedapp/core'

export const CHAIN_ID = (parseInt(process.env.REACT_APP_CHAIN_ID ?? ChainId.BSC.toString())) as ChainId
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

console.log('IS_PRODUCTION', IS_PRODUCTION)
console.log('CHAIN_ID', CHAIN_ID)
