import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  STAKE,
  UNSTAKE,
  WALLET,
}

export const setOpenModal = createAction<ApplicationModal | undefined>('application/setOpenModal')

export const setKogeCount = createAction<string | undefined>('application/setKogeCount')

