import React, { FC, useEffect } from 'react'
import { Col, Row } from 'antd'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { selectTab } from 'store/selectors/messenger'
import ChatsExtra from './Chats'
import PersonalChatsExtra from './PersonalChats'
import FolderExtra from './Folder'

import styles from './Extra.module.less'

interface ChatListExtraProps {
  id: string
}

const ChatListExtra: FC<ChatListExtraProps> = props => {
  const { id } = props

  const tab = useAppSelector(selectTab(id))!
  const isChatsTab = tab.key === 'chats'
  const isPersonalTab = tab.key === 'personalChats'
  const isFolderTab = tab.key === 'folder'

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isChatsTab) {
      dispatch(managerSliceActions.setChatsTabSelectable(
        tab.extra === 'createFolder' || tab.extra === 'addChatsToFolder',
      ))
    }
    if (isPersonalTab) {
      dispatch(managerSliceActions.setPersonalChatsTabSelectable(
        tab.extra === 'createGroup',
      ))
    }
    if (isFolderTab) {
      dispatch(managerSliceActions.setFolderTabSelectable({
        id: tab.id,
        selectable: tab.extra === 'deleteFolderChats',
      }))
    }
  }, [tab.extra])

  useEffect(() => {
    if (isChatsTab) {
      if (tab.extra === 'addChatsToFolder' && Object.keys(tab.selected).length === 0) {
        dispatch(managerSliceActions.setChatsTabExtra(null))
        dispatch(managerSliceActions.setChatsTabSelectable(false))
      }
    }
    if (isFolderTab) {
      if (tab.extra === 'deleteFolderChats' && Object.keys(tab.selected).length === 0) {
        dispatch(managerSliceActions.setFolderTabExtra({ id: tab.id, extra: null }))
        dispatch(managerSliceActions.setFolderTabSelectable({ id: tab.id, selectable: false }))
      }
    }
  }, [tab.selected])

  return (
    tab.selectable
      ? (
        <Row className={styles.ChatListExtra} justify={'space-between'} align={'middle'}>
          <Col className={styles.selected}>Selected: {Object.keys(tab.selected).length}</Col>
          <Row className={styles.choice} gutter={8}>
            {isChatsTab && <ChatsExtra tab={tab} />}
            {isPersonalTab && <PersonalChatsExtra tab={tab} />}
            {isFolderTab && <FolderExtra tab={tab} />}
          </Row>
        </Row>
      )
      : (
        <></>
      )

  )
}

export default ChatListExtra
