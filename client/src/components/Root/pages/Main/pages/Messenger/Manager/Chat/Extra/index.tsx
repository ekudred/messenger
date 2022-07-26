import React, { FC } from 'react'
import { Row, Col } from 'antd'

import styles from './Extra.module.less'

const ChatExtra: FC = () => {
  return (
    <Row className={styles.ChatExtra}>
      <Col className={styles.typing}>ekudred typing...</Col>
    </Row>
  )
}

export default ChatExtra