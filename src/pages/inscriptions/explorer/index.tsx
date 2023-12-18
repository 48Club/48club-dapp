import { useNavigate } from "react-router-dom"
import ExplorerHeader from "./ExplorerHeader"
import InscriptionsRecord from "./InscriptionsRecord"

const Explorer = () => {

    const nav = useNavigate()

    
    const onSearch = () => {
        nav('/inscriptions/account')
    }

    return <div className="w-full mt-[32px]">
        <ExplorerHeader onSearch={onSearch} />
        <InscriptionsRecord />
    </div>
}

export default Explorer