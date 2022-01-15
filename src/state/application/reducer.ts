import { createReducer } from '@reduxjs/toolkit'
import { ApplicationModal, setKogeCount, setOpenModal } from './actions'

export interface ApplicationState {
  modal?: ApplicationModal,
  kogeCount?: string,
}

const initialState: ApplicationState = {
  modal: undefined,
  kogeCount: undefined,
}

export default createReducer(initialState, builder => {
    builder
      .addCase(setOpenModal, (state, action) => {
        state.modal = action.payload != null ? action.payload : undefined
      })
      .addCase(setKogeCount, (state, action) => {
        state.kogeCount = action.payload || undefined
      })
  },
)
