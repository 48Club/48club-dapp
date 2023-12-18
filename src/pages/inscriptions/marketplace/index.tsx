import { useState } from "react";
import ChartLine from "./ChartLine";


const Marketplace = () => {
    
    const [time, setTime] = useState<"Line" | "1S" | "1M" | "5M" | "15M" | "1H" | "4H">('Line')

    return <div>

        <div className="flex text-[10px] font-[400] leading-[20px] items-center">
            <span style={time === "Line" ? { color: "var(--main-text-color)", opacity: 1 } : { color: "black", opacity: 0.3 }} onClick={() => setTime("Line")} className=" cursor-pointer">Line</span>
            <span style={time === "1S" ? { color: "var(--main-text-color)", opacity: 1 } : { color: "black", opacity: 0.3 }} onClick={() => setTime("1S")} className="ml-[18px] cursor-pointer">1S</span>
            <span style={time === "1M" ? { color: "var(--main-text-color)", opacity: 1 } : { color: "black", opacity: 0.3 }} onClick={() => setTime("1M")} className="ml-[18px] cursor-pointer">1M</span>
            <span style={time === "5M" ? { color: "var(--main-text-color)", opacity: 1 } : { color: "black", opacity: 0.3 }} onClick={() => setTime("5M")} className="ml-[18px] cursor-pointer">5M</span>
            <span style={time === "15M" ? { color: "var(--main-text-color)", opacity: 1 } : { color: "black", opacity: 0.3 }} onClick={() => setTime("15M")} className="ml-[18px] cursor-pointer">15M</span>
            <span style={time === "1H" ? { color: "var(--main-text-color)", opacity: 1 } : { color: "black", opacity: 0.3 }} onClick={() => setTime("1H")} className="ml-[18px] cursor-pointer">1H</span>
            <span style={time === "4H" ? { color: "var(--main-text-color)", opacity: 1 } : { color: "black", opacity: 0.3 }} onClick={() => setTime("4H")} className="ml-[18px] cursor-pointer">4H</span>
        </div>
        <div className="w-full h-[214px] mt-[14px] mb-[10px]">
            <ChartLine />
        </div>
    </div>
}

export default Marketplace;