import { FC, CSSProperties } from 'react'
import { CheckOutlined, LoadingOutlined } from '@ant-design/icons'

interface ChatMessageListItemCheckProps {
  sent: boolean
  read: boolean
  style?: CSSProperties
}

const ChatMessageListItemCheck: FC<ChatMessageListItemCheckProps> = (props) => {
  const { sent, read, style } = props

  if (sent) {
    return <CheckOutlined style={{ fontSize: '10px', color: read ? '#1890ff' : '#cccccc', ...style }} />
  } else {
    return <LoadingOutlined style={{ fontSize: '10px', color: '#cccccc', ...style }} />
  }
}

export default ChatMessageListItemCheck