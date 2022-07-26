import React, { FC } from 'react'
import { Modal, Button } from 'antd'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { selectTab } from 'store/selectors/messenger'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { FolderManagerActions } from 'store/actions/messenger'
import { FolderTab } from 'store/types/messenger/manager'

interface DeleteFolderModalProps {
  folderID: string
}

const DeleteFolderModal: FC<DeleteFolderModalProps> = props => {
  const { folderID } = props

  const folderTab = (useAppSelector(selectTab(folderID)) as FolderTab)!
  const { deleteFolder: deleteFolderAction } = folderTab.actions

  const dispatch = useAppDispatch()

  const handleCancel = () => {
    dispatch(managerSliceActions.setFolderTabModal({ id: folderID, field: 'deleteFolder', action: { visible: false } }))
  }

  const handleSubmit = () => {
    const { id, name } = folderTab

    dispatch({ type: FolderManagerActions.DELETE_FOLDER, payload: { folderID: id, folderName: name } })
  }

  return (
    <Modal
      title="Delete folder"
      visible={folderTab.modals.deleteFolder.visible}
      forceRender
      confirmLoading={deleteFolderAction.status === 'loading'}
      transitionName={''}
      maskTransitionName={''}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type={'primary'}
          danger
          loading={deleteFolderAction.status === 'loading'}
          onClick={handleSubmit}
        >
          Delete
        </Button>,
      ]}
    >
      {`Are you sure you want to delete the folder "${folderTab.name}"?`}
    </Modal>
  )
}

export default DeleteFolderModal
