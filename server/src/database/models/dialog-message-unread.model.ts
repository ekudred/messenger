import {
  Table,
  Model,
  Column,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  Scopes,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import Dialog from './dialog.model'
import DialogMessage from './dialog-message.model'
import DialogRoster from './dialog-roster.model'

export interface DialogMessageUnreadAttributes {
  id: string
  message_id: string
  roster_item_id: string
  dialog_id: string
  updated_at: Date
  created_at: Date
}

export type DialogMessageUnreadCreationAttributes = Optional<DialogMessageUnreadAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  dialogChat: ({ whereMessages }: any) => {
    return {
      include: [{
        model: Dialog.scope([
          { method: ['roster', {}] },
          { method: ['messages', { whereMessages }] }
        ]),
        as: 'dialog'
      }]
    }
  },
  dialog: ({}: any) => {
    return {
      include: [{
        model: Dialog.scope([
          { method: ['roster', {}] },
          { method: ['lastMessage', {}] },
          { method: ['unreadMessages', {}] }
        ]),
        as: 'dialog'
      }]
    }
  },
  message: ({}: any) => {
    return {
      include: [{
        model: DialogMessage.scope([{ method: ['author', {}] }, { method: ['unread', {}] }]),
        as: 'message'
      }]
    }
  },
  rosterItem: ({ whereUser }: any) => {
    return {
      include: [{
        model: DialogRoster.scope([{ method: ['user', { where: whereUser }] }]),
        as: 'roster_item'
      }]
    }
  }
}))
@Table({ tableName: 'dialog_message_unread' })
class DialogMessageUnread extends Model<DialogMessageUnreadAttributes, DialogMessageUnreadCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => DialogMessage)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare message_id: string

  @ForeignKey(() => DialogRoster)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare roster_item_id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => DialogMessage)
  declare message: DialogMessage

  @BelongsTo(() => DialogRoster)
  declare roster_item: DialogRoster

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default DialogMessageUnread