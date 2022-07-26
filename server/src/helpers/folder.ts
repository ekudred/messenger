import { Folder } from '../services/folder/types'
import TransformedDialog from './dialog'
import TransformedGroup from './group'
import FolderModel from '../database/models/folder.model'

interface TransformedChatDialog {
  type: 'user'
  chat: TransformedDialog
}

interface TransformedChatGroup {
  type: 'group'
  chat: TransformedGroup
}

class TransformedFolder implements Folder {
  public id: string
  public name: string
  public userID: string
  public list: (TransformedChatDialog | TransformedChatGroup)[]
  public createdAt: Date
  public updatedAt: Date

  constructor(model: FolderModel) {
    this.id = model.id
    this.userID = model.user_id
    this.name = model.name

    const chatDialogs: TransformedChatDialog[] = model.dialogs.map(folderDialog => ({
      type: 'user', chat: new TransformedDialog(folderDialog.dialog)
    }))
    const chatGroups: TransformedChatGroup[] = model.groups.map(folderGroup => ({
      type: 'group', chat: new TransformedGroup(folderGroup.group)
    }))

    this.list = [...chatDialogs, ...chatGroups]
    this.createdAt = model.created_at
    this.updatedAt = model.updated_at
  }
}

export default TransformedFolder