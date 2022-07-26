import { ActionStatus, Modal } from './common'

interface UserProfile {
  avatar: string | null
  username: string | null
  fullname: string | null
  birthdate: string | null
  email?: string | null
  phone?: string | null
}

export interface InitialState {
  user: UserProfile
  actions: {
    edit: ActionStatus
  }
  modals: {
    confirmModal: Modal<{}, {}>
  }
  isEdit: boolean
}
