export default function ipfsToHttp(i: string | undefined) {
  if (!i) {
    return
  }
  return `https://${i.replace('ipfs://', '')}.ipfs.infura-ipfs.io/`
}
