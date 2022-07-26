import React, { FC } from 'react'
import { Avatar, Row, Col, Typography } from 'antd'
import moment from 'moment-timezone'
import cs from 'classnames'

import { ChatMessage } from 'store/types/messenger/chat'
import ChatMessageListItemContent from './Content'
import { format } from 'utils/format'

import styles from './Item.module.less'

interface ChatMessageProps {
  parent: boolean
  message: ChatMessage
  timezone: string
}

const ChatMessageListItem: FC<ChatMessageProps> = (props) => {
  const { parent, message, timezone } = props
  const { author, text, createdAt, sent, read, type } = message

  return (
    <Row className={cs({ [styles.ChatMessageListItem]: true, [styles.unread]: type === 'me' ? !read : false })}>
      {
        parent
          ? (
            <Row className={styles.parent} wrap={false}>
              <Col className={styles.presentation}>
                <Row className={styles.avatar} align={'middle'}>
                  <Avatar src={author.avatar} />
                </Row>
              </Col>
              <Col className={styles.content}>
                <Row className={styles.title} justify={'start'} align={'top'}>
                  <Col className={styles.name}>
                    <Typography.Paragraph ellipsis className={styles.paragraph}>
                      {author.username}
                    </Typography.Paragraph>
                  </Col>
                  <Col className={styles.date}>
                    {moment(createdAt).tz(timezone).format(format.messageTime)}
                  </Col>
                </Row>
                <Row className={styles.message} justify={'start'} align={'middle'}>
                  <ChatMessageListItemContent
                    sent={sent}
                    read={read}
                    type={type}
                    style={{ padding: '0 16px 0 0' }}
                    checkStyle={{ position: 'absolute', right: '0', bottom: '0', lineHeight: '20px' }}
                  >
                    {text}
                  </ChatMessageListItemContent>
                </Row>
              </Col>
            </Row>
          )
          : (
            <Row className={styles.children} justify={'start'} align={'middle'}>
              <ChatMessageListItemContent
                sent={sent}
                read={read}
                type={type}
                style={{ padding: '0 16px 0 0' }}
                checkStyle={{ position: 'absolute', right: '0', bottom: '0', lineHeight: '20px' }}
              >
                {text}
              </ChatMessageListItemContent>
            </Row>
          )
      }
    </Row>
  )
}

export default ChatMessageListItem