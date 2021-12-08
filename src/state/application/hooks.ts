import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { ApplicationModal, setOpenModal } from './actions'

/********** SELECTOR **********/
export function useModalOpen(modal: ApplicationModal) {
  const application = useSelector((state: AppState) => state.application)
  return { modalOpen: modal === application.modal, modalId: application.modalId }
}

/********** ACTION **********/
export function useOpenModal(modal: ApplicationModal, id?: number) {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal({ modal, id })), [dispatch, modal, id])
}

export function useCloseModals() {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal({ modal: undefined })), [dispatch])
}
