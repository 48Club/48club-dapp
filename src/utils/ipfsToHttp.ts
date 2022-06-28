export default function ipfsToHttp(i: string | undefined) {
  if (!i) {
    return
  }
  return `https://ipfs.bnb48.club/ipfs/${i.replace('ipfs://', '')}`
}
