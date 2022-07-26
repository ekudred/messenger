import React, { FC, ReactNode } from 'react'
import { Empty, Spin } from 'antd'

import { useAppSelector } from 'hooks/store'

interface ChatMessageListContainerProps {
  children?: ReactNode
}

const ChatMessageListContainer: FC<ChatMessageListContainerProps> = (props) => {
  const { children } = props

  const { messenger } = useAppSelector(store => store)
  const { messages } = messenger.chat.body
  const { joinChat: joinChatAction } = messenger.chat.actions

  return (
    joinChatAction.status === 'loading'
      ? <Spin style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      : (
        messages.length === 0
          ? (
            <Empty
              description={'Write something'}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          )
          : <>{children}</>
      )
  )
}

export default ChatMessageListContainer