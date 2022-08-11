import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

export const createPoolType = atom<1 | 2 | 3>(1) // 1 create ; 2 restart; 3 append;
export const createPoolShow = atom(false)
export const createPoolMeta = atom({ stakingToken: '', rewardToken: '', rewardRate: '', startTime: '', poolId: '' })

export const stakeShow = atom(false)
export const stakeOrClaim = atom<1 | 2 | undefined>(undefined) // 1 stake ; 2 claim
export const currentPoolAddress = atom('')

export const useCreatePoolShow = () => {
  const [isShow, setShow] = useAtom(createPoolShow)
  const [type, setType] = useAtom(createPoolType)
  const [poolMeta, setPoolMeta] = useAtom(createPoolMeta)

  const showCreate = useCallback(
    (
      type: 1 | 2 | 3,
      poolMeta?: {
        stakingToken: string
        rewardToken: string
        rewardRate: string
        startTime: string
        poolId: string
      }
    ) => {
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
      setPoolMeta({ stakingToken: '', rewardToken: '', rewardRate: '', startTime: '', poolId: '' })
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
