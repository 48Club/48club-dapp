import { createReducer } from '@reduxjs/toolkit'
import { ApplicationModal, setKogeCount, setOpenModal } from './actions'

export interface ApplicationState {
  modal?: ApplicationModal
  kogeCount?: string
}

const initialState: ApplicationState = {
  modal: undefined,
  kogeCount: undefined,
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(setOpenModal, (state, { payload }) => {
      console.log('[payload]:', payload)
      state.modal = payload
    })
    .addCase(setKogeCount, (state, { payload }) => {
      state.kogeCount = payload
    })
})

