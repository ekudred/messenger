import React, { FC, useEffect } from 'react'
import { Layout } from 'antd'
import cs from 'classnames'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import useWindowDimensions from 'hooks/useWindowDimensions'
import { ChatManagerActions, FolderManagerActions } from 'store/actions/messenger'
import CustomSpin from 'components/common/CustomSpin'
import MessengerManagerTabs from './Tabs'
import Chat from './Chat'
import { MediaWidth } from 'utils/media'

import styles from './Manager.module.less'

const MessengerManager: FC = () => {
  const { messenger, auth } = useAppSelector(store => store)
  const { socket } = messenger.manager
  const { getChats: getChatsAction, getDialogs: getDialogsAction, getFolders: getFoldersAction } = messenger.manager.actions
  const { userID } = auth.info

  const dispatch = useAppDispatch()
  const { width } = useWindowDimensions()

  const messengerManagerFrontier = width < MediaWidth.messengerManagerFrontier
  const messengerChatFrontier = width < MediaWidth.messengerChatFrontier

  useEffect(() => {
    if (socket.chatManager.connected && getChatsAction.status !== 'done') {
      dispatch({ type: ChatManagerActions.GET_CHATS, payload: { userID } })
    }
  }, [socket.chatManager.connected])

  useEffect(() => {
    if (socket.chatManager.connected && getDialogsAction.status !== 'done') {
      dispatch({ type: ChatManagerActions.GET_DIALOGS, payload: { userID } })
    }
  }, [socket.chatManager.connected])

  useEffect(() => {
    if (socket.folderManager.connected && getFoldersAction.status !== 'done') {
      dispatch({ type: FolderManagerActions.GET_FOLDERS, payload: { userID } })
    }
  }, [socket.folderManager.connected])

  return (
    <Layout.Content className={cs({ [styles.MessengerManager]: true, [styles.chatFrontier]: !messengerChatFrontier })}>
      {(getChatsAction.status === 'loading' || getChatsAction.status !== 'done') &&
      getFoldersAction.status !== 'done' ? (
        <CustomSpin />
      ) : (
        <>
          <MessengerManagerTabs frontier={messengerManagerFrontier} />
          <Chat frontier={messengerChatFrontier} />
        </>
      )}
    </Layout.Content>
  )
}

export default MessengerManager
