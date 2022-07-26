import { UserResponse } from 'API/common/types'
import { User, Role, ActionStatus, Modal } from 'store/types/common'

export class TransformedUser implements User {
  public id: string
  public username: string
  public fullname: string
  public birthdate: string
  public avatar: string
  public role: Role
  public updatedAt: string
  public createdAt: string

  constructor(user: UserResponse) {
    this.id = user.id
    this.username = user.username
    this.fullname = user.fullname
    this.birthdate = user.birthdate
    this.avatar = user.avatar
    this.role = user.role
    this.updatedAt = user.updatedAt
    this.createdAt = user.createdAt
  }
}

export const setActionStatus = (field: ActionStatus, action: ActionStatus) => {
  field.status = action.status
  field.message = action.message ?? null
}

export const setModalAction = (field: Modal<any, any>, action: Modal<any, any>) => {
  field.visible = action.visible ?? field.visible
  field.options = action.options ?? field.options
  field.selected = action.selected ?? field.selected
}