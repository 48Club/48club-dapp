import { atom, useAtom } from 'jotai'

export const createPoolShow = atom(false)
export const stakeShow = atom(false)
export const stakeOrClaim = atom<1 | 2>(1) // 1 stake ; 2 claim

export const useCreatePoolShow = () => {
  return useAtom(createPoolShow)
}

export const useStakeShow = () => {
  return useAtom(stakeShow)
}

export const useStakeOrClaim = () => {
  const [currentType, setCurrentType] = useAtom(stakeOrClaim)
  return {
    currentType,
    setCurrentType,
  }
}