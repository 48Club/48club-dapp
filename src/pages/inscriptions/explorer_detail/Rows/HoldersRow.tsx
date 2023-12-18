import { HoldersDataProps } from "@/utils/request.type";
import { shorten } from "@funcblock/dapp-sdk"

export type HoldersRowDataProps = HoldersDataProps & { progress: number, rank: number, amount: number }

const HoldersRow:React.FC<{
    data: HoldersRowDataProps;
    oneData: HoldersRowDataProps
}> = ({ data, oneData }) => {

    const _progress = isNaN(data.progress) ? 0 : data.progress;

    const show_progress = (data.amount / oneData.amount) * 100;

    return (
        <div onClick={() => window.open(`https://bscscan.com/address/${data.address}`)} className="cursor-pointer hover:bg-[#f4f4f4] py-4 flex flex-row justify-between items-center border-t border-gray text-[14px]">
            <div className="w-[140px] text-[14px] font-[400] leading-[20px]">
                {data.rank}
            </div>
            <div className="w-[240px] flex items-center cursor-pointer">
                <span className=" underline mr-[8px]">{shorten(data.address)}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.2387 7.24886V10.873C11.2387 11.4835 10.7256 12 10.1193 12H1.11938C0.513048 12 0 11.4835 0 10.873V1.81258C0 1.20217 0.513048 0.685669 1.11938 0.685669H4.71935C4.99574 0.685669 5.23931 0.929136 5.23931 1.20739C5.23931 1.48563 4.99747 1.73084 4.71935 1.73084H1.11938C1.06755 1.73084 1.03819 1.7604 1.03819 1.81258V10.873C1.03819 10.9252 1.06755 10.9548 1.11938 10.9548H10.1193C10.1711 10.9548 10.2005 10.9252 10.2005 10.873V7.24886C10.2005 6.97061 10.4423 6.72714 10.7187 6.72714C10.9951 6.72714 11.2387 6.97061 11.2387 7.24886Z" fill="black" />
                    <path d="M11.237 1.20739V4.52898C11.237 4.80723 10.9952 5.05069 10.7188 5.05069C10.4424 5.05069 10.2006 4.80723 10.2006 4.52898V2.46472L6.29832 6.39151C6.20503 6.48541 6.07893 6.53411 5.92001 6.53411C5.76108 6.53411 5.63498 6.48715 5.5417 6.39324C5.44151 6.29238 5.38623 6.16195 5.38623 6.0263C5.38623 5.89066 5.44151 5.76023 5.5417 5.65936L9.47334 1.73084H7.41942C7.14303 1.73084 6.90119 1.48737 6.90119 1.20739C6.90119 0.929136 7.14303 0.685669 7.41942 0.685669H10.7188C10.9952 0.685669 11.237 0.929136 11.237 1.20739Z" fill="black" />
                </svg>
            </div>
            <div className="w-[240px]">
                <p>{_progress}%</p>
                <div className="w-[104px] h-[8px] overflow-hidden rounded-full bg-[rgba(255,200,1,.2)]">
                    <div style={{ width: `${show_progress}%` }} className="h-full rounded-full bg-[#FFC801]"></div>
                </div>
            </div>
            <div className="w-[240px]">
                {data.amount}
            </div>
        </div>
    )
}

export default HoldersRow