import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  STAKE,
  UNSTAKE,
}

export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')

export const setKogeCount = createAction<string | undefined>('application/setKogeCount')
