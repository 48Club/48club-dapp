import { ethers } from "ethers";


export const decimalsToStr = (num: number, decimals: number) => {
    if(num === undefined || decimals === undefined) return 0;
    return +ethers.utils.formatUnits(num.toString(), decimals).toString()
}

export const strToDecimals = (num: number, decimals: number) => {
    return +ethers.utils.parseUnits(num.toString(), decimals).toString()
}