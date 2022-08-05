import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

export const createPoolType = atom<1 | 2 | 3>(1) // 1 create ; 2 restart; 3 append;
export const createPoolShow = atom(false)
export const stakeShow = atom(false)
export const stakeOrClaim = atom<1 | 2>(1) // 1 stake ; 2 claim
export const currentPoolAddress = atom('')

export const useCreatePoolShow = () => {
  const [ show, setShow ] = useAtom(createPoolShow)
  const [ type, setType] = useAtom(createPoolType)
  const showCreate = useCallback((type: 1 | 2 | 3) => {
    setType(type)
    setShow(true)
  }, [setShow, setType])


  return {
    show,
    showCreate,
    hide: () => setShow(false)
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
