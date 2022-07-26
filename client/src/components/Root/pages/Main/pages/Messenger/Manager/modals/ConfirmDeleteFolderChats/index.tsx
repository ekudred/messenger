import React, { FC } from 'react'
import { Button, Modal } from 'antd'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { FolderManagerActions } from 'store/actions/messenger'
import { selectTab } from 'store/selectors/messenger'
import { FolderTab } from 'store/types/messenger/manager'

interface ConfirmDeleteFolderChatsModalProps {
  folderID: string
}

const ConfirmDeleteFolderChatsModal: FC<ConfirmDeleteFolderChatsModalProps> = props => {
  const { folderID } = props

  const folderTab = (useAppSelector(selectTab(folderID)) as FolderTab)!

  const dispatch = useAppDispatch()

  const handleCancel = () => {
    dispatch(
      managerSliceActions.setFolderTabModal({
        id: folderID,
        field: 'confirmDeleteFolderChats',
        action: { visible: false },
      })
    )
  }

  const handleSubmit = () => {
    const deleted = Object.entries(folderTab.selected).reduce(
      (total: any, chat) => {
        if (chat[1] === 'user') total.dialogs.push({ id: chat[0] })
        if (chat[1] === 'group') total.groups.push({ id: chat[0] })

        return total
      },
      { dialogs: [], groups: [] }
    )

    dispatch({
      type: FolderManagerActions.EDIT_FOLDER,
      payload: {
        folderID,
        folderName: folderTab.name,
        list: { deleted, added: { dialogs: [], groups: [] } },
      },
    })
  }

  return (
    <Modal
      title={`Delete ${Object.keys(folderTab.selected).length} chats from "${folderTab.name}"`}
      visible={folderTab.modals.confirmDeleteFolderChats.visible}
      forceRender
      confirmLoading={folderTab.actions.editFolder.status === 'loading'}
      transitionName={''}
      maskTransitionName={''}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={folderTab.actions.editFolder.status === 'loading'}
          onClick={handleSubmit}
        >
          Delete chats
        </Button>,
      ]}
    >
      {`Are you sure you want to delete ${Object.keys(folderTab.selected).length} chats from "${folderTab.name}"?`}
    </Modal>
  )
}

export default ConfirmDeleteFolderChatsModal
