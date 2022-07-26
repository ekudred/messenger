import { Action as ReduxAction } from 'redux'

export type Role = 'USER' | 'ADMIN'
export type Status = 'idle' | 'loading' | 'succeeded' | 'failed' | 'done'

export interface Action<T> extends ReduxAction {
  type: string
  payload: T
}

export interface EmitInput {
  event: string
  data: any
}

export interface ActionStatus {
  status: Status
  message?: string | null
}

export interface User {
  id: string
  username: string
  fullname: string
  birthdate: string
  avatar: string
  role: Role
  updatedAt: string
  createdAt: string
}

export interface Socket {
  connected: boolean
}

export interface Drawer {
  visible: boolean
}

export interface Modal<T, Y> {
  visible: boolean
  selected?: T
  options?: Y
}
