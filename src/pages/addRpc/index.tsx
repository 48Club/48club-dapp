import { BNB0gweiChain } from "@/constants/chain";
import { useParams } from "react-router";


const AddRpc = () => {
    let { upath } = useParams()
    console.log(upath);
    onload = async () => {
        let dnsQuery = await fetch(`https://cloudflare-dns.com/dns-query?name=${upath}.rpc.48.club&type=A`, {
            method: 'GET',
            headers: {
                'Accept': 'application/dns-json'
            }
        }).then((response) => {
            return response.json();
        });

        if (dnsQuery.Status !== 0 || !dnsQuery.Answer || dnsQuery.Answer.length === 0) {
            alert('Invalid Request')
            return
        }

        let chain = BNB0gweiChain
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
