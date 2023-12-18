import { useNavigate } from "react-router-dom";
import BatchTransfer from "./BatchTransfer";


const AccountMobileBetch = () => {
    const nav = useNavigate()
    
    return <div className="md:hidden block">
        <div className="flex items-center mt-[32px]">
            <svg onClick={() => nav(-1)} className=" cursor-pointer" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="16" fill="#FFFBEC" />
                <path d="M15.828 21.0001L21.192 26.3641L19.778 27.7781L12 20.0001L19.778 12.2221L21.192 13.6361L15.828 19.0001L28 19.0001L28 21.0001L15.828 21.0001Z" fill="#A9A9A9" />
            </svg>
        </div>
        <BatchTransfer />
    </div>
}

export default AccountMobileBetch;