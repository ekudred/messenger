import React, { FC } from 'react'
import { Button, Col } from 'antd'
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons'

import { FolderTab } from 'store/types/messenger/manager'
import ConfirmDeleteFolderChatsModal from '../../../modals/ConfirmDeleteFolderChats'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { useAppDispatch } from 'hooks/store'

interface FolderExtraProps {
  tab: FolderTab
}

const FolderExtra: FC<FolderExtraProps> = (props) => {
  const { tab } = props

  const dispatch = useAppDispatch()

  // DeleteFolderChats
  const cancelDeleteFolderChats = () => {
    dispatch(managerSliceActions.setFolderTabExtra({ id: tab.id, extra: null }))

    dispatch(managerSliceActions.setFolderTabSelectable({ id: tab.id, selectable: false }))
    dispatch(managerSliceActions.clearFolderTabSelected({ id: tab.id }))
  }
  const showDeleteFolderChatsModal = () => {
    dispatch(
      managerSliceActions.setFolderTabModal({
        id: tab.id,
        field: 'confirmDeleteFolderChats',
        action: { visible: true },
      }),
    )
  }

  return (
    <>
      {tab.extra === 'deleteFolderChats' && (
        <>
          <Col>
            <Button icon={<CloseOutlined />} shape={'circle'} onClick={() => cancelDeleteFolderChats()} />
          </Col>
          <Col>
            <Button icon={<DeleteOutlined />} shape={'circle'} onClick={() => showDeleteFolderChatsModal()} />
          </Col>
          <ConfirmDeleteFolderChatsModal folderID={tab.id} />
        </>
      )}
    </>
  )
}

export default FolderExtra