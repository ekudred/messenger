import { ActionStatus, Role } from './common'

export interface InitialState {
  isAuth: boolean
  isConfirm: boolean
  info: Info
  actions: {
    signUp: ActionStatus
    signIn: ActionStatus
    signOut: ActionStatus
    refresh: ActionStatus
    confirm: ActionStatus
  }
}

export interface Info {
  userID: string | null
  role: Role | null
  accessToken: string | null
  updatedAt: string | null
  createdAt: string | null
}
