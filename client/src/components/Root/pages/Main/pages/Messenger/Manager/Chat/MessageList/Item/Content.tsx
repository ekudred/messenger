import React, { FC, ReactNode, CSSProperties } from 'react'
import { Typography } from 'antd'

import { ChatMessageType } from 'store/types/messenger/chat'
import ChatMessageListItemCheck from './Check'

interface ChatMessageListItemContentProps {
  sent: boolean
  read: boolean
  type: ChatMessageType
  style?: CSSProperties
  checkStyle?: CSSProperties
  children?: ReactNode
}

const ChatMessageListItemContent: FC<ChatMessageListItemContentProps> = (props) => {
  const { sent, read, type, style, checkStyle, children } = props

  return (
    <Typography.Paragraph style={{ position: 'relative', width: '100%', height: '100%', margin: 0, ...style }}>
      {children}
      {type === 'my' && <ChatMessageListItemCheck sent={sent} read={read} style={checkStyle} />}
    </Typography.Paragraph>
  )
}

export default ChatMessageListItemContent