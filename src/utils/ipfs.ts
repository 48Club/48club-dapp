import * as ipfsClient from 'ipfs-http-client'

const projectId = '26MNz6wshb1eYqdOAjnosI5wxDQ'
const projectSecret = '132c5ee9fb42557194239e861abc24ae'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const ipfs = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})
export default ipfs
