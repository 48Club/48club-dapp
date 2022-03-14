import type { IPFS } from 'ipfs-core'

declare global {
  interface Window { IPFS: IPFS }
}
