import { ActionStatus } from './common'

export interface InitialState {
  client: ClientState
  actions: {
    getResultFP: ActionStatus
  }
}

export interface ClientState {
  id: string | null
  timezone: string | null
}