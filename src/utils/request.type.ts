


export type PageProps<T> = {
    count: number,
    page: number,
    page_size: number,
    list: T
}

export type ResponseData<T> = {
    code: number;
    data: T;
}



export type ExplorerDataProps = {
    tick: string;
    tick_hash: string;
    block_at: number;
    holders: number;
    minted: number;
    max: number;
    decimals: number;
    miners: string;
    protocol: string;
    lim: number;
    deploy_by: string;
}


export type RequestExplorerProps = ResponseData<PageProps<ExplorerDataProps[]>>;



export type HoldersDataProps = {
    balance: number;
    address: string;
}


export type RequestHoldersProps = ResponseData<PageProps<HoldersDataProps[]>>;



export type TransferDataProps = {
    block_at: number;
    tx_hash: string;
    from: string;
    to: string;
    input_decode: {
        amt: number;
        op: string;
    }
}



export type RequestTransferProps = ResponseData<PageProps<TransferDataProps[]>>



export type AccountBalanceDataProps = {
    tick: string;
    tick_hash: string;
    balance: number;
    protocol: string;
    decimals: number;
}

type RequestAccountBalanceWrap = {
    wallet: AccountBalanceDataProps[]
}

export type RequestAccountBalanceProps = ResponseData<RequestAccountBalanceWrap>