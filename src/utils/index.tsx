

export const decimalsToStr = (num: number, decimals: number) => {
    return num / Math.pow(10, decimals);
}


export const strToDecimals = (num: number, decimals: number) => {
    return num * Math.pow(10, decimals);
}