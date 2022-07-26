import React, { FC } from 'react'
import { Col } from 'antd'

import TopBar from './TopBar'
import ChatList from './ChatList'

import styles from './ChatList/ChatList.module.less'

interface MessengerManagerContentProps {
  id: string
  frontier?: boolean
}

const MessengerManagerContent: FC<MessengerManagerContentProps> = props => {
  const { id, frontier } = props

  return (
    <Col className={styles.MessengerManagerContent}>
      <TopBar id={id} />
      <ChatList id={id} frontier={frontier} />
    </Col>
  )
}

export default MessengerManagerContent