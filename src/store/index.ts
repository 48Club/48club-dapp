import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

type IPoolMeta = {
  stakingToken: string | undefined
  rewardToken: string
  rewardRate: string
  startTime: string
  poolId: number | undefined
  status: 1 | 2 | 0 | undefined
}

export const createPoolType = atom<1 | 2 | 3>(1) // 1 create ; 2 restart; 3 append;
export const createPoolShow = atom(false)
export const createPoolMeta = atom<IPoolMeta>({
  stakingToken: undefined,
  rewardToken: '',
  rewardRate: '',
  startTime: '',
  poolId: undefined,
  status: undefined,
})
export const rewardTokenSymbolList = atom<Record<string, string>>({})

export const stakeShow = atom(false)
export const stakeOrClaim = atom<1 | 2 | undefined>(undefined) // 1 stake ; 2 claim
export const currentPoolAddress = atom('')

export const useCreatePoolShow = () => {
  const [isShow, setShow] = useAtom(createPoolShow)
  const [type, setType] = useAtom(createPoolType)
  const [poolMeta, setPoolMeta] = useAtom(createPoolMeta) as unknown as [IPoolMeta, (config: IPoolMeta) => void ]


  const showCreate = useCallback(
    (type: 1 | 2 | 3, poolMeta?: IPoolMeta) => {
      setType(type)
      if (poolMeta) {
        setPoolMeta(poolMeta)
      }

      setShow(true)
    },
    [setPoolMeta, setShow, setType]
  )

  return {
    isShow,
    showCreate,
    poolType: type,
    poolMeta,
    hide: () => {
      setShow(false)
      setPoolMeta({
        stakingToken: undefined,
        rewardToken: '',
        rewardRate: '',
        startTime: '',
        poolId: undefined,
        status: undefined,
      })
    },
  }
}

export const useStakeShow = () => {
  return useAtom(stakeShow)
}

export const useStakeOrClaim = () => {
  const [currentType, setCurrentType] = useAtom(stakeOrClaim)
  const [curAddress, setCurAddress] = useAtom(currentPoolAddress)

  return {
    currentType,
    setCurrentType,
    curAddress,
    setCurAddress,
  }
}

export const useRewardTokenSymbolList = () => {
  const [list, setList] = useAtom(rewardTokenSymbolList)

  return { list, setList }
}
