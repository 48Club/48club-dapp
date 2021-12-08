import { createReducer } from '@reduxjs/toolkit'
import { ApplicationModal, setOpenModal } from './actions'

export interface ApplicationState {
  modal?: ApplicationModal,
  modalId?: number,
}

const initialState: ApplicationState = {
  modal: undefined,
  modalId: undefined,
}

export default createReducer(initialState, builder => {
    builder
      .addCase(setOpenModal, (state, action) => {
        state.modal = action.payload.modal
        state.modalId = action.payload.id
      })
  },
)
