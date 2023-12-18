import SelectedToken from "./SelectedToken";
import BatchTransfer from "./BatchTransfer";


const AccountBody = () => {

    return <div className="mt-[64px] flex">
        <div className="flex-1 w-[49%]">
            <SelectedToken />
        </div>
        <div className="md:block hidden w-[49%]">
            <BatchTransfer />
        </div>
    </div>
}

export default AccountBody;