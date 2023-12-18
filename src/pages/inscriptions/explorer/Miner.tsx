import { DeployMinersProps } from "@/constants/inscriptions";
import { shorten } from "@funcblock/dapp-sdk";
import { Tooltip, Typography } from "antd";

const Miner: React.FC<{
    miner: DeployMinersProps[number];
    delMiner?: () => void;
    className?: string;
}> = ({ miner, delMiner, className }) => {
    return <Tooltip overlayClassName="miner-address-detail-copy" trigger={["hover", "click"]} title={<Typography.Paragraph copyable>{miner.address}</Typography.Paragraph>} color="#FFC801" key={miner.address}>
        <span key={miner.address} className={`bg-[rgba(255,200,1,.1)] cursor-pointer mr-[12px] px-[10px] py-[2px] rounded-full flex items-center ${className ?? ''}`}>
            <i className='inline-block w-[5px] h-[5px] bg-[#FFC801] rounded-full'></i>
            <span className='mx-[5px] whitespace-nowrap'>{miner.name.startsWith('0x') ? shorten(miner.name) : miner.name}</span>
            {
                delMiner && <svg onClick={(e) => {
                    e.stopPropagation();
                    delMiner()
                }} className='cursor-pointer' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_1724_617)">
                        <path d="M6.00036 5.29312L8.47536 2.81812L9.18236 3.52512L6.70736 6.00012L9.18236 8.47512L8.47536 9.18212L6.00036 6.70711L3.52536 9.18212L2.81836 8.47512L5.29336 6.00012L2.81836 3.52512L3.52536 2.81812L6.00036 5.29312Z" fill="#A9A9A9" />
                    </g>
                    <defs>
                        <clipPath id="clip0_1724_617">
                            <rect width="12" height="12" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            }

        </span>
    </Tooltip>
}

export default Miner;