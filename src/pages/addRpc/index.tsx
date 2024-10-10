import { BNB0geiChain } from "@/constants/chain";
import { useParams } from "react-router";

// 白名单 upath 列表, a-z 排序
const upathList = [
    'bitget',
    'four',
    'hellodex',
    'math',
    'pancake',
    'tp',
]
const AddRpc = () => {
    let { upath } = useParams()
    console.log(upath);
    onload = async () => {
        if (!upathList.includes(upath || '')) {
            alert('Invalid upath')
            return
        }
        let chain = BNB0geiChain
        chain.chainName = '48Club Privacy RPC'
        chain.rpcUrls = [`https://${upath}.rpc.48.club`]
        try {
            if (window.ethereum && window.ethereum.request) {
                await window.ethereum.request({
                    method: 'eth_requestAccounts',
                    params: [],
                })
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [chain],
                })
                alert('RPC added successfully')
            }
        } catch (e: any) {
            alert(e?.message || 'Failed to add RPC')
        }
    }
    console.log('add_rpc');
    return (
        < div className="info-section"
            style={{
                height: '480px',
                fontSize: '24px',
            }}
        >
            <p>
                You are adding 48Club Privacy RPC
            </p>
        </div >
    )
}
export default AddRpc
