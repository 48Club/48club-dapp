import { AccountTokenProps } from "@/constants/inscriptions";
import { AccountBalanceDataProps } from "@/utils/request.type";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

type IPoolMeta = {
  stakingToken: string | undefined;
  rewardToken: string;
  rewardRate: string;
  startTime: string;
  poolId: number | undefined;
  status: 1 | 2 | 0 | undefined;
};

export const createPoolType = atom<1 | 2 | 3>(1); // 1 create ; 2 restart; 3 append;
export const createPoolShow = atom(false);
export const createPoolMeta = atom<IPoolMeta>({
  stakingToken: undefined,
  rewardToken: "",
  rewardRate: "",
  startTime: "",
  poolId: undefined,
  status: undefined,
});
export const rewardTokenSymbolList = atom<Record<string, string>>({});

export const stakeShow = atom(false);
export const stakeOrClaim = atom<1 | 2 | undefined>(undefined); // 1 stake ; 2 claim
export const currentPoolAddress = atom("");

export const useCreatePoolShow = () => {
  const [isShow, setShow] = useAtom(createPoolShow);
  const [type, setType] = useAtom(createPoolType);
  const [poolMeta, setPoolMeta] = useAtom(createPoolMeta) as unknown as [
    IPoolMeta,
    (config: IPoolMeta) => void
  ];

  const showCreate = useCallback(
    (type: 1 | 2 | 3, poolMeta?: IPoolMeta) => {
      setType(type);
      if (poolMeta) {
        setPoolMeta(poolMeta);
      }

      setShow(true);
    },
    [setPoolMeta, setShow, setType]
  );

  return {
    isShow,
    showCreate,
    poolType: type,
    poolMeta,
    hide: () => {
      setShow(false);
      setPoolMeta({
        stakingToken: undefined,
        rewardToken: "",
        rewardRate: "",
        startTime: "",
        poolId: undefined,
        status: undefined,
      });
    },
  };
};

export const useStakeShow = () => {
  return useAtom(stakeShow);
};

export const useStakeOrClaim = () => {
  const [currentType, setCurrentType] = useAtom(stakeOrClaim);
  const [curAddress, setCurAddress] = useAtom(currentPoolAddress);

  return {
    currentType,
    setCurrentType,
    curAddress,
    setCurAddress,
  };
};

export const useRewardTokenSymbolList = () => {
  const [list, setList] = useAtom(rewardTokenSymbolList);

  return { list, setList };
};

const filterStatus = atom({
  status: -1,
  stakeAddress: "",
});

export const usePoolFilter = () => {
  const [filterDetail, setFilterDetail] = useAtom(filterStatus);

  return {
    filterDetail,
    setFilterDetail,
  };
};


const localAddStrList = localStorage.getItem("Import_Hash_Address_List");
let localAddList: any[] = [];
if(localAddStrList) {
  localAddList = JSON.parse(localAddStrList)
}

export type SearchResultList = AccountTokenProps &
  AccountBalanceLocalDataProps & { amount?: number };

const inscriptionsSearchTextHash = atom<string>("");
const inscriptionsSearchText = atom<string>('');

const inscriptionsSearchLoading = atom(false)
const inscriptonssSearchResult = atom<SearchResultList[]>([]);

export const useInscriptionsSearchState = () => {
  const [searchText, setSearchText] = useAtom(inscriptionsSearchText);
  const [loading, setLoading] = useAtom(inscriptionsSearchLoading)
  const [result, setResult] = useAtom(inscriptonssSearchResult)
  const [searchTextHash, setSearchTextHash] = useAtom(inscriptionsSearchTextHash);

  return {
    setLoading,
    loading,
    setSearchTextHash,
    searchTextHash,
    setSearchText,
    searchText,
    setResult,
    result
  };
};


export type AccountBalanceLocalDataProps = AccountBalanceDataProps & {
  type?: string;
}
const inscriptionsLocalHashList = atom<AccountBalanceLocalDataProps[]>(localAddList)

export const useInscriptionsLocalHashList = () => {
  const [localHashList, _setLocalHashList] = useAtom(inscriptionsLocalHashList);

  const setLocalHashList = (addList: AccountBalanceLocalDataProps[]) => {
    localStorage.setItem("Import_Hash_Address_List", JSON.stringify(addList))
    _setLocalHashList(addList)
  }

  return {
    localHashList,
    setLocalHashList
  }
}

const inscriptionsBetchTransferState = atom<SearchResultList>({} as SearchResultList);

export const useInscriptionsBetchTransferState = () => {
  const [betchTransferState, setBetchTransferState] = useAtom(
    inscriptionsBetchTransferState
  );

  const setSelectedToken = (token: SearchResultList) => {
    setBetchTransferState(token);
  };

  return {
    betchTransferState,
    setSelectedToken,
  };
};


export type InscriptonsEffectDataProps = {
  border: string,
  lv: string,
  tick_hash: string
}

const inscriptionsEffectData = atom<InscriptonsEffectDataProps[]>([] as InscriptonsEffectDataProps[]);

export const useInscriptionsEffectData = () => {
  const [effectData, setEffectData] = useAtom(inscriptionsEffectData);

  return {
    effectData,
    setEffectData
  }
}