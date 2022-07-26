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

import Group from './group.model'
import GroupMessage from './group-message.model'
import GroupRoster from './group-roster.model'

export interface GroupMessageUnreadAttributes {
  id: string
  message_id: string
  roster_item_id: string
  group_id: string
  updated_at: Date
  created_at: Date
}

export type GroupMessageUnreadCreationAttributes = Optional<GroupMessageUnreadAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  groupChat: ({ whereMessages }: any) => {
    return {
      include: [{
        model: Group.scope([{ method: ['roster', {}] }, { method: ['messages', { whereMessages }] }, { method: ['creator', {}] }]),
        as: 'group'
      }]
    }
  },
  group: ({}: any) => {
    return {
      include: [{
        model: Group.scope([
          { method: ['roster', {}] },
          { method: ['lastMessage', {}] },
          { method: ['creator', {}] },
          { method: ['unreadMessages', {}] }
        ]),
        as: 'group'
      }]
    }
  },
  message: ({}: any) => {
    return {
      include: [{
        model: GroupMessage.scope([{ method: ['author', {}] }, { method: ['unread', {}] }]),
        as: 'message'
      }]
    }
  },
  rosterItem: ({ whereUser }: any) => {
    return {
      include: [{
        model: GroupRoster.scope([{ method: ['user', { where: whereUser }] }]),
        as: 'roster_item'
      }]
    }
  }
}))
@Table({ tableName: 'group_message_unread' })
class GroupMessageUnread extends Model<GroupMessageUnreadAttributes, GroupMessageUnreadCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => GroupMessage)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare message_id: string

  @ForeignKey(() => GroupRoster)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare roster_item_id: string

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare group_id: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => Group)
  declare group: Group

  @BelongsTo(() => GroupMessage)
  declare message: GroupMessage

  @BelongsTo(() => GroupRoster)
  declare roster_item: GroupRoster
}

export default GroupMessageUnread