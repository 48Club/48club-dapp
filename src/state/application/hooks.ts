import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { ApplicationModal, setKogeCount, setOpenModal } from './actions'

/********** SELECTOR **********/
export function useModalOpen(modal: ApplicationModal) {
  const application = useSelector((state: AppState) => state.application)
  return modal === application.modal
}

export function useKogeCount(): string | undefined {
  return useSelector((state: AppState) => state.application.kogeCount)
}

/********** ACTION **********/
export function useOpenModal(modal: ApplicationModal, kogeCount: string | undefined = undefined) {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => {
    dispatch(setOpenModal(modal))
    dispatch(setKogeCount(kogeCount))
  }, [dispatch, modal, kogeCount])
}

export function useCloseModals() {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(undefined)), [dispatch])
}
