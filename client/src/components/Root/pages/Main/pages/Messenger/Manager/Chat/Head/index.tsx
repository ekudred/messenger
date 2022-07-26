import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Row, Col, Button, Typography } from 'antd'
import { LeftOutlined } from '@ant-design/icons'

import { useAppSelector } from 'hooks/store'

import styles from './Head.module.less'

const ChatHead: FC = () => {
  const { messenger } = useAppSelector(store => store)
  const { type, name, avatar } = messenger.chat.head
  const { joinChat: joinChatAction } = messenger.chat.actions

  const navigate = useNavigate()

  const onClose = () => {
    navigate(-1)
  }

  return (
    <Row className={styles.ChatHead} justify="space-between" align="middle" wrap={false} gutter={16}>
      <Col>
        {(joinChatAction.status === 'done' || joinChatAction.status === 'failed') &&
          <Button type="dashed" icon={<LeftOutlined />} style={{ borderRadius: '50%' }} onClick={onClose} />}
      </Col>
      {
        joinChatAction.status === 'loading'
          ? (
            <>
              <Col className={styles.loading}>Loading...</Col>
              <Col className={styles.loading}></Col>
            </>
          )
          : type !== 'empty' &&
          (
            <>
              <Col flex={'1'} className={styles.name}>
                <Typography.Paragraph ellipsis className={styles.paragraph}>
                  {name}
                </Typography.Paragraph>
              </Col>
              <Col className={styles.avatar}><Avatar src={avatar} /></Col>
            </>
          )
      }
    </Row>
  )
}

export default ChatHead
