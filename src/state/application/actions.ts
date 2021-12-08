import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  WALLET,
  SUBSCRIBE,
  UNSUBSCRIBE,
  WITHDRAW,
}

export const setOpenModal = createAction<{ modal?: ApplicationModal, id?: number }>('application/setOpenModal')
