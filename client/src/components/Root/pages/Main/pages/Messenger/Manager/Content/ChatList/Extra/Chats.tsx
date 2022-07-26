import React, { FC } from 'react'
import { Button, Col } from 'antd'
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'

import { ChatsTab } from 'store/types/messenger/manager'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { useAppDispatch } from 'hooks/store'
import AddChatsToFolderModal from '../../../modals/AddChatsToFolder'
import CreateFolderModal from '../../../modals/CreateFolder'

interface ChatsExtraProps {
  tab: ChatsTab
}

const ChatsExtra: FC<ChatsExtraProps> = (props) => {
  const { tab } = props

  const dispatch = useAppDispatch()

  // CreateFolder
  const cancelCreateFolder = () => {
    dispatch(managerSliceActions.setChatsTabExtra(null))

    dispatch(managerSliceActions.setChatsTabSelectable(false))
    dispatch(managerSliceActions.clearChatsTabSelected())
  }
  const showCreateFolderModal = () => {
    dispatch(managerSliceActions.setChatsTabModal({ field: 'createFolder', action: { visible: true } }))
  }

  // AddChatsToFolder
  const cancelAddChatsToFolder = () => {
    dispatch(managerSliceActions.setChatsTabExtra(null))

    dispatch(managerSliceActions.setChatsTabSelectable(false))
    dispatch(managerSliceActions.clearChatsTabSelected())
  }
  const showAddChatsToFolderModal = () => {
    dispatch(managerSliceActions.setChatsTabModal({ field: 'addChatsToFolder', action: { visible: true } }))
  }

  return (
    <>
      {tab.extra === 'createFolder' && (
        <>
          <Col>
            <Button icon={<CloseOutlined />} shape={'circle'} onClick={() => cancelCreateFolder()} />
          </Col>
          <Col>
            <Button
              icon={<CheckOutlined />}
              shape={'circle'}
              onClick={() => showCreateFolderModal()}
              loading={tab.actions.createFolder.status === 'loading'}
              disabled={Object.keys(tab.selected).length < 1}
            />
          </Col>
          <CreateFolderModal />
        </>
      )}
      {tab.extra === 'addChatsToFolder' && (
        <>
          <Col>
            <Button icon={<CloseOutlined />} shape={'circle'} onClick={() => cancelAddChatsToFolder()} />
          </Col>
          <Col>
            <Button icon={<PlusOutlined />} shape={'circle'} onClick={() => showAddChatsToFolderModal()} />
          </Col>
          <AddChatsToFolderModal />
        </>
      )}

    </>
  )
}

export default ChatsExtra