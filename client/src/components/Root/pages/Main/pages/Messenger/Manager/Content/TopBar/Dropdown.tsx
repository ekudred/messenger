import React, { FC } from 'react'
import { Dropdown, Menu } from 'antd'
import {
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  UsergroupAddOutlined,
  FolderAddOutlined,
} from '@ant-design/icons'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { selectTab } from 'store/selectors/messenger'

interface TopBarDropdownProps {
  id: string
}

const TopBarDropdown: FC<TopBarDropdownProps> = props => {
  const { id } = props

  const tab = useAppSelector(selectTab(id))!
  const isChatsTab = tab.key === 'chats'
  const isPersonalTab = tab.key === 'personalChats'
  const isFolderTab = tab.key === 'folder'

  const dispatch = useAppDispatch()

  const setCreateFolderExtra = () => {
    if (isChatsTab) {
      dispatch(managerSliceActions.setChatsTabExtra('createFolder'))
    }
  }
  const setCreateGroupExtra = () => {
    if (isPersonalTab) {
      dispatch(managerSliceActions.setPersonalChatsTabExtra('createGroup'))
    }
  }
  const showDeleteFolderModal = () => {
    if (isFolderTab) {
      dispatch(
        managerSliceActions.setFolderTabModal({
          id,
          field: 'deleteFolder',
          action: { visible: true, selected: {} },
        })
      )
    }
  }
  const showEditFolderModal = () => {
    if (isFolderTab) {
      dispatch(
        managerSliceActions.setFolderTabModal({
          id,
          field: 'editFolder',
          action: { visible: true },
        })
      )
    }
  }

  return (
    <Dropdown
      trigger={['click']}
      placement={'bottomRight'}
      overlay={
        <>
          {isChatsTab && (
            <Menu
              items={[
                {
                  key: 'create-folder',
                  icon: <FolderAddOutlined style={{ fontSize: '16px' }} />,
                  label: 'New folder',
                  disabled: tab.extra === 'createFolder',
                  onClick: setCreateFolderExtra,
                },
              ]}
            />
          )}
          {isPersonalTab && (
            <Menu
              items={[
                {
                  key: 'create-group',
                  icon: <UsergroupAddOutlined style={{ fontSize: '16px' }} />,
                  label: 'New group',
                  disabled: tab.extra === 'createGroup',
                  onClick: setCreateGroupExtra,
                },
              ]}
            />
          )}
          {isFolderTab && (
            <Menu
              items={[
                {
                  key: 'edit-folder',
                  icon: <EditOutlined style={{ fontSize: '16px' }} />,
                  label: 'Edit',
                  onClick: showEditFolderModal,
                },
                {
                  key: 'delete-folder',
                  icon: <DeleteOutlined style={{ fontSize: '16px' }} />,
                  label: 'Delete',
                  onClick: showDeleteFolderModal,
                },
              ]}
            />
          )}
        </>
      }
    >
      <EllipsisOutlined style={{ fontSize: '24px' }} />
    </Dropdown>
  )
}

export default TopBarDropdown
