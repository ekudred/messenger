import React, { FC, ReactNode } from 'react'
import { Layout } from 'antd'

import { useAppSelector } from 'hooks/store'
import useNotificationEffect from 'hooks/useNotificationEffect'

interface MessengerLayoutProps {
  children?: ReactNode
}

const MessengerLayout: FC<MessengerLayoutProps> = (props) => {
  const { children } = props

  const { messenger } = useAppSelector(store => store)
  const { joinChat: joinChatAction, sendMessage: sendMessageAction } = messenger.chat.actions
  const { createFolder: createFolderAction } = messenger.manager.tabs.default['0'].actions
  const { createGroup: createGroupAction } = messenger.manager.tabs.default['1'].actions

  const messengerInfo = { message: '', description: '' }
  if (joinChatAction.status === 'failed') {
    messengerInfo.message = 'Error'
    messengerInfo.description = joinChatAction.message!
  }
  if (sendMessageAction.status === 'failed') {
    messengerInfo.message = 'Error'
    messengerInfo.description = sendMessageAction.message!
  }
  // if (searchChatsAction.status === 'failed') {
  //   messengerInfo.message = 'Error'
  //   messengerInfo.description = searchChatsAction.error!
  // }
  if (createGroupAction.status === 'succeeded') {
    messengerInfo.message = 'Amazing!'
    messengerInfo.description = createGroupAction.message!
  }
  if (createGroupAction.status === 'failed') {
    messengerInfo.message = 'Error'
    messengerInfo.description = createGroupAction.message!
  }
  if (createFolderAction.status === 'succeeded') {
    messengerInfo.message = 'Amazing!'
    messengerInfo.description = createFolderAction.message!
  }
  if (createFolderAction.status === 'failed') {
    messengerInfo.message = 'Error'
    messengerInfo.description = createFolderAction.message!
  }
  // if (editFolderAction.status === 'succeeded') {
  //   messengerInfo.message = 'Nice!'
  //   messengerInfo.description = editFolderAction.message!
  // }
  // if (editFolderAction.status === 'failed') {
  //   messengerInfo.message = 'Error'
  //   messengerInfo.description = editFolderAction.error!
  // }
  // if (deleteFolderAction.status === 'succeeded') {
  //   messengerInfo.message = 'Good!'
  //   messengerInfo.description = deleteFolderAction.message!
  // }
  // if (deleteFolderAction.status === 'failed') {
  //   messengerInfo.message = 'Error'
  //   messengerInfo.description = deleteFolderAction.error!
  // }

  useNotificationEffect(
    { ...messengerInfo },
    notification => {
      if (joinChatAction.status === 'failed') notification.error()

      if (sendMessageAction.status === 'failed') notification.error()

      // if (searchChatsAction.status === 'failed') notification.error()

      if (createGroupAction.status === 'succeeded') notification.success()
      if (createGroupAction.status === 'failed') notification.error()

      if (createFolderAction.status === 'succeeded') notification.success()
      if (createFolderAction.status === 'failed') notification.error()

      // if (editFolderAction.status === 'succeeded') notification.success()
      // if (editFolderAction.status === 'failed') notification.error()
      //
      // if (deleteFolderAction.status === 'succeeded') notification.success()
      // if (deleteFolderAction.status === 'failed') notification.error()
    },
    [joinChatAction, sendMessageAction, createGroupAction, createFolderAction]
  )

  return (
    <Layout>{children}</Layout>
  )
}

export default MessengerLayout